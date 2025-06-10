from langchain.chat_models import ChatOpenAI
from langchain.agents import Tool, initialize_agent
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage
import re

def construct_llm_node(config, node_id):
    prompt_template = config.get("prompt", "")
    tools_config = config.get("tools", [])
    mode = config.get("mode", "chain")

    tools = [
        Tool(name=t["name"], func=eval(t["function"]), description=t.get("description", ""))
        for t in tools_config
    ]

    variable_names = re.findall(r"{(.*?)}", prompt_template)

    def llm_node(data):
        input_message = data["input"]
        state = data["state"]

        # Crea il dizionario di variabili da sostituire nel prompt
        values = {}
        for var in variable_names:
            values[var] = state.get(var, input_message.content)

        print(f"[{node_id}] Prompt template: {prompt_template}")
        print(f"[{node_id}] Prompt values: {values}")

        llm = ChatOpenAI(temperature=0)

        if mode == "agent" and tools:
            agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)
            output = agent.run(prompt_template.format(**values))
        else:
            prompt_obj = PromptTemplate(template=prompt_template, input_variables=list(values.keys()))
            chain = LLMChain(llm=llm, prompt=prompt_obj)
            output = chain.run(values)

        state[node_id] = output
        return {}

    return llm_node

def construct_if_node(config, node_id):
    condition_code = config.get("condition")
    true_node = config.get("true_node")
    false_node = config.get("false_node")

    def if_node(data):
        input_message = data["input"]
        state = data["state"]

        print(f"[{node_id}] Valutazione condizione: {condition_code}")
        try:
            result = eval(condition_code, {}, {"input": input_message.content, "state": state})
        except Exception as e:
            result = False
            print(f"[{node_id}] Errore nella valutazione della condizione: {e}")

        next_node = true_node if result else false_node
        state[node_id] = {"condition": condition_code, "result": result, "next": next_node}

        return {"input": input_message, "state": state, "__next__": next_node}

    return if_node
