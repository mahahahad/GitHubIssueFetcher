import Nav from "./components/Nav"
import CardContainer from "./components/CardContainer"
import Filter from "./components/Filter"

function App() {
  const bodyContainerStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
  }

  return (
    <>
      <Nav />
      <div style={bodyContainerStyles}>
        <Filter />
        <CardContainer />
      </div>
    </>
  )
}

export default App
