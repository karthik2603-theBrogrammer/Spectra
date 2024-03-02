import Graph from "react-graph-vis";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import axios from "axios"
import { Toaster, toast } from "sonner"
import CsvDownloadButton from 'react-json-to-csv'

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
  nodes: {
    borderWidth: 5,
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
  const [loading, setLoading] = useState(null);
  const [graphLoading, setGraphLoading] = useState(false);


  const [modalNode, setModalNode] = useState(null)
  const [modalDataLoading, setModalDataLoading] = useState(false)
  const [modalData, setModalData] = useState(null)

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpen = (backdrop) => {
    onOpen();
  }


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
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setApiData(data.result);
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

      const colorTo = walletId === node.to_address ? "white" : "red";
      const colorFrom = walletId === node.from_address ? "white" : "green";

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
          color: colorTo,
          // image: "/casino-chip.png"
          image: "https://mimi-panda.com/wp-content/uploads/2023/02/marguerite-729510_640.jpg"
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
          color: colorFrom,
        });
      }

      edges.push({
        from: node.from_address,
        to: node.to_address,
      });

      setGraphLoading(false);
      setLoading(false);
    });

    setState({
      graph: { nodes, edges },
      events: {
        click: ({ nodes, exists }) => {
          if (nodes.length > 0) {
            console.log(nodes);
            handleOpen();
            const myWalletId = nodes[0]
            setModalNode(myWalletId);
            
            toast.info(`You are viewing wallet ID  ${myWalletId}`);
            axios.get(`https://onchainanalysis.vercel.app/api/crypto/${myWalletId}`)
              .then((res) => {
                console.log(res.data)
                // alert(JSON.stringify(res.data))
                setModalData(res.data)

              }).catch((err) => {
                console.log(JSON.stringify(err))
              })
          }
        },

        doubleClick: (nodes) => {
          console.log(nodes);
          nodes.nodes[0] != null && setGraphLoading(true);
          nodes.nodes[0] != null && navigate(`/graph/${nodes.nodes[0]}`);
        },
      },
    });
  }, [apiData]);
  const navigate = useNavigate();
  const handleSubmit = () => {
    setLoading(true);
    setGraphLoading(true);

    if (senderAddress === null) {
      setGraphLoading(false);
      setLoading(false);
      toast.error(`Enter a valid wallet address`);
      return;
    }
    navigate(`/graph/${senderAddress}`);
  };

  return (
    <>
      <Toaster />
      <div className="h-[100vh] w-[100vw] bg-black bg-grid-white/[0.2] relative flex flex-col items-center justify-center">
        <div
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,1) 100%)",
          }}
          className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        ></div>
        <div className="w-full h-full flex flex-col justify-center text-center md:justify-start items-center">
          <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
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
                  isLoading={loading}
                  onClick={() => handleSubmit()}
                >
                  Submit!
                </Button>
              </div>

              {apiData === null || graphLoading ? (
                <Spinner
                  label="Loading..."
                  color="default"
                  labelColor="foreground"
                  className="xl"
                />
              ) : (
                <div className="w-full h-full border-1 border-white">
                  <Graph graph={graph} options={options} events={events} />
                </div>
              )}
            </div>
          </p>
          <Modal backdrop="blur" isOpen={isOpen} onClose={() => {
            setModalData(null)
            onClose();
          }} className="bg-white  border-2 border-gray-400">
            <ModalContent>
              {(onClose) => (
                <>
                  {
                    modalDataLoading || modalData === null ? (<div className="py-6 flex flex-col items-center justify-center">
                      <Spinner
                        label="Loading..."
                        color="secondary"
                        labelColor="foreground"
                        className="xl text-black"
                      />

                    </div>) : (<>

                      <ModalHeader className="flex flex-col gap-1 text-black font-bold">{modalNode?.substring(0, 30).concat("...")}</ModalHeader>
                      <ModalBody className="text-black max-h-[400px] overflow-y-auto">
                        <p>
                          Address : {modalData?.address}
                        </p>
                        <p>
                          Balance : {modalData?.balance} WEI
                        </p>
                        <p>
                          Transaction Count : {modalData?.transactionCount}
                        </p>
                        
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="light" onClick={() => {
                          // modalNode
                          onClose()
                          navigate(`/graph/${modalNode}`);
                        }}>
                          Explore
                        </Button>
                        <Button color="danger" variant="light"  onClick={() => {
                          axios.post("https://onchainanalysis.vercel.app/api/monitor/address", { address: senderAddress }).then((res) => {
                            toast.info(JSON.stringify(res.data));
                          }).catch((err) => {
                            toast.error(`Some Error Occures, ${JSON.stringify(err)}`)
                          })
                        }}>
                          Flag
                        </Button>
                        <Button color="danger" variant="light" onClick={() => {
                          axios.get("https://onchainanalysis.vercel.app/api/monitor/address/list").then((res) => {
                            alert(JSON.stringify(res?.data?.data.list))
                          }).catch((err) => {
                            toast.error(`Some Error Occures, ${JSON.stringify(err)}`)
                          })
                        }}>
                          Monitored
                        </Button>


                        {/* {
                          apiData && (<Button color="primary" onPress={onClose} className='flex items-center justify-center'>
                            <svg class=" relative bottom-0.5 w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4c0 .6.4 1 1 1h14c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1h-2m-1-5-4 5-4-5m9 8h0" />
                            </svg>
                            <p className="">Download</p>
                          </Button>)
                        } */}
                        {apiData && (
                          <CsvDownloadButton data={apiData} className="bg-red-500 hover:scale-90 transition " >Download</CsvDownloadButton>
                        )}

                      </ModalFooter>
                    </>)
                  }
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default GraphComponent;
