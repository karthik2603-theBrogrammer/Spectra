import Graph from "react-graph-vis";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Input, Button } from "@nextui-org/react";
const options = {
  layout: {
    hierarchical: false,
  },
  edges: {
    color: "white",
    length: 500,
    smooth: {
      enabled: true,
      type: "dynamic",
      roundness: 0.5,
    },
  },
  interaction: {
    hover: true,
  },
};

function randomColor() {
  const red = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const green = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const blue = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  return `#${red}${green}${blue}`;
}

const GraphComponent = () => {
  const [apiData, setApiData] = useState(null);
  const [senderAddress, setSenderAddress] = useState(null);

  let { walletId } = useParams();
  const centralNode = "0x10D5dbc4894ebD78f980282dc94F7F4bB9864778";
  const pageSize = "100";

  const createNode = (x, y) => {
    // const color = randomColor();
    const color = "#7be041";
    setState(({ graph: { nodes, edges }, counter, ...rest }) => {
      const id = counter + 1;
      const from = Math.floor(Math.random() * (counter - 1)) + 1;
      return {
        graph: {
          nodes: [...nodes, { id, label: `Node ${id}`, color, x, y }],
          edges: [...edges, { from, to: id }],
        },
        counter: id,
        ...rest,
      };
    });
  };
  const [state, setState] = useState({
    counter: 5,
    graph: {
      nodes: [
        { id: 1, label: "Node 1", color: "#e04141" },
        { id: 2, label: "Node 2", color: "#e09c41" },
        { id: 3, label: "Node 3", color: "#e0df41" },
        { id: 4, label: "Node 4", color: "#7be041" },
        { id: 5, label: "Node 5", color: "#41e0c9" },
      ],
      edges: [
        { from: 2, to: 2 },
        { from: 2, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
      ],
    },
    events: {
      select: ({ nodes, edges }) => {
        console.log("Selected nodes:");
        console.log(nodes);
        console.log("Selected edges:");
        console.log(edges);
      },
      doubleClick: ({ pointer: { canvas } }) => {
        createNode(canvas.x, canvas.y);
      },
    },
  });
  const { graph, events } = state;

  useEffect(() => {
    console.log(walletId);
    if (walletId === null) return;
    const url = `https://onchainanalysis.vercel.app/api/eth/0x1/${walletId}/${pageSize}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setApiData(data[0].result);
      });
  }, [walletId]);

  useEffect(() => {
    if (apiData === null) return;
    console.log(apiData);

    const nodes = [];
    const edges = [];

    apiData?.forEach((node) => {
      const existingToNode = nodes.find((n) => n.id === node.to_address);
      const existingFromNode = nodes.find((n) => n.id === node.from_address);

      if (!existingToNode) {
        nodes.push({
          id: node.to_address,
          label:
            node.to_address.substring(0, 4) +
            "..." +
            node.to_address.substring(
              node.to_address.length - 5,
              node.to_address.length - 1
            ),
            title: node.to_address_label ? node.to_address_label : "",
          color: randomColor(),
        });
      }
      if (!existingFromNode) {
        nodes.push({
          id: node.from_address,
          label:
            node.from_address.substring(0, 4) +
            "..." +
            node.from_address.substring(
              node.from_address.length - 5,
              node.from_address.length - 1
            ),
            title: node.from_address_label ? node.from_address_label : "",
          color: randomColor(),
        });
      }

      edges.push({
        from: node.from_address,
        to: node.to_address,
      });
    });

    setState({
      graph: { nodes, edges },
      events: {
        doubleClick: (nodes) => {
          console.log(nodes);
          navigate(`/graph/${nodes.nodes[0]}`);
        },
      },
    });
  }, [apiData]);
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (senderAddress === null) return;
    navigate(`/graph/${senderAddress}`);
  };

  return (
    <div className="flex flex-col items-center  h-[100vh] w-[100vw] gap-10 p-10">
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <Input
          type="text"
          color="secondary"
          label="Address 0x12"
          placeholder="Enter Your Sender Address:"
          className="w-[300px]"
          onChange={(e) => setSenderAddress(e.target.value)}
        />
        <Button
          color="secondary"
          variant="shadow"
          onClick={() => handleSubmit()}
        >
          Submit!
        </Button>
      </div>

      {apiData === null ? (
        "Enter bro ☠️"
      ) : (
        <Graph
          graph={graph}
          options={options}
          events={events}
          // style={{ height: "640px" }}
        />
      )}
    </div>
  );
};

export default GraphComponent;
