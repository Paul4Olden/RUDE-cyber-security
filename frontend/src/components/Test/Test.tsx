import Status from "../Status/Status"

interface Props {

}

const data = [{ label: "received" }, { label: "awaiting" }, { label: "undergoing" }, { label: "analyzed" }, { label: "modified" }, { label: "deferred" }, { label: "rejected" }, { label: "default" }]

const Test = (props: Props) => {
  return (
    <div className="test">
      Test
      <Status data={data} />
    </div>
  )
}

export default Test
