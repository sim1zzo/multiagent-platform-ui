from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, TypedDict, Annotated
from constructors import construct_llm_node, construct_if_node
from langgraph.graph import StateGraph
from langchain.schema import HumanMessage
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GraphInput(BaseModel):
    graph: Dict[str, Any]

# Stato del ticket
class GrafoState(TypedDict):
    input: Annotated[HumanMessage, "Input"]
    state: dict

@app.post("/create-agent")
async def create_agent(input_data: GraphInput):
    graph_data = input_data.graph
    nodes = {n["id"]: n for n in graph_data.get("nodes", [])}
    edges = graph_data.get("edges", [])
    end_nodes = graph_data.get("end_nodes", [])

    # Costruzione del grafo con schema esplicito
    builder = StateGraph(GrafoState)
    node_functions = {}

    # Add nodes
    for node_id, node in nodes.items():
        node_type = node.get("type")
        config = node.get("config", {})

        if node_type == "llm":
            func = construct_llm_node(config, node_id)
        elif node_type == "if":
            func = construct_if_node(config, node_id)
        else:
            continue

        builder.add_node(node_id, func)
        node_functions[node_id] = func

    # Add edges
    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        builder.add_edge(source, target)

    # Set entrypoint and end nodes
    start_node = graph_data.get("start_node")
    input_text = graph_data.get("input", "")
    builder.set_entry_point(start_node)

    for end_node in end_nodes:
        builder.set_finish_point(end_node)

    app_graph = builder.compile()

    # Execute graph
    result = app_graph.invoke({
        "input": HumanMessage(content=input_text),
        "state": {}
    })

    return {"message": "LangGraph agent executed successfully", "outputs": result}
