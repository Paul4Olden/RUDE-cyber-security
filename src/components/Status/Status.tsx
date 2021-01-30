import Tag from "../Tag/Tag";

export interface StatusData {
  link?: string,
  onClick?: ((event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void) | undefined,
  label: string
}
interface Props {
  data: StatusData | Array<StatusData>;
}

const color: any = {
  received: "blue",
  awaiting: "yellow",
  undergoing: "orange",
  analyzed: "green",
  rejected: "red",
  default: "default"
}

const Status = ({ data }: Props) => {
  if (Array.isArray(data)) {
    return <>
      {data.map((item, index) =>
      (<Tag key={index} type={color[item.label.toLowerCase()] ? color[item.label.toLowerCase()] : color.default} onClick={item.onClick} link={item.link}>
        {item.label}
      </Tag>))}
    </>

  }
  return <Tag
    type={color[data.label] ? color[data.label] : color.default}
    onClick={data.onClick}
    link={data.link}>
    {data.label}
  </Tag>
}

export default Status
