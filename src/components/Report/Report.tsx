import { useState, useEffect } from "react"
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import { useFormik } from 'formik';
import { useSelector, useDispatch } from "react-redux";
import { Copy } from "@styled-icons/boxicons-regular";
import CopyToClipboard from 'react-copy-to-clipboard';
import { RootState } from "../../redux/reducers/rootReducer";
import { Threat } from "../../api"
import { API } from "../../api/"
import { showNulls, hideNulls } from "../../redux/actions";

import TableRow from "../TableRow/TableRow";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import Status from "../Status/Status";
import RadioInput from "../RadioInput/RadioInput";
import ThreatField from "../ThreatField/ThreatField";
import Ioc from "../Ioc/Ioc";
import Malware from "../Malware/Malware";

import CheckBoxInput from "../CheckBoxInput/CheckBoxInput";

interface IParams {
  id: string;
}

interface IRequest {
  error: null | any;
  status: null | number;
  data: null | Threat;
  isLoading: boolean | undefined;
}

const Report = () => {
  const { id } = useParams<IParams>();
  const alert = useAlert();
  const showEmptyFields = useSelector((store: RootState) => store.selectors.showNulls);
  console.log(showEmptyFields)
  const formik = useFormik({
    initialValues: {
      checked: showEmptyFields,
      comment: "",
      checkStatus: "Need Check"
    },
    onSubmit: (values: any) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });
  console.log(formik.values.checked)
  const [requestState, setRequestState] = useState<IRequest>({
    error: null,
    status: null,
    data: null,
    isLoading: undefined,
  })
  const dispatch = useDispatch()


  const [similarReports, setSimilarReports] = useState<Array<string>>(["95ccc286-62f5-11eb-ae93-0242ac130002", "c616dfe4-62f5-11eb-ae93-0242ac130002"]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setRequestState({
        ...requestState,
        isLoading: true,
      })
    }
    API.getReport(id).then(response => {
      if (mounted) {
        setRequestState({
          ...requestState,
          data: response.data,
          isLoading: false,
        })
      }
    }).catch(error => {
      if (mounted) {
        setRequestState({
          ...requestState,
          isLoading: false,
          error: error,
        })
        alert.error("Ошибка при загрузке отчета, попробуйте перезагрузить страницу")
      }
    })
    return () => {
      mounted = false;
    }
  }, [])

  useEffect(() => {
    let mounted = true;

    if (formik.values.checked) {
      dispatch(showNulls());
    }
    else {
      dispatch(hideNulls());
    }

    return () => {
      mounted = false;
    }
  }, [formik.values.checked])

  return (
    <div className="report">
      <div className="report__id">Отчет {requestState.data && requestState.data.name} #{id}   <CopyToClipboard text={window.location.href}
        onCopy={() => alert.show("Ссылка на отчет успешно скопирована")}>
        <Copy className="report__id-copy-btn" size="35" />
      </CopyToClipboard></div>
      <div className="reports__similar-label">Похожие отчеты</div>
      <div className="reports__similar">
        <Status data={similarReports.map(similarReport => {
          return {
            label: similarReport,
          }
        })} />
      </div>
      <CheckBoxInput
        checked={formik.values.checked}
        onChange={formik.handleChange("checked")}
        inputId="checked"
        label="Показывать пустые строки в таблице"
      />
      {requestState.data && <table className="table">
        <tbody>
          {
            requestState.data.name || showEmptyFields ? <TableRow rowKey={"Name"} tooltip={"https://nvd.nist.gov/vuln"}>
              {requestState.data.name}
            </TableRow> : ""
          }
          {
            requestState.data.cve.length || showEmptyFields ? <TableRow rowKey={"CVE"} tooltip={"https://nvd.nist.gov/vuln"}>
              {requestState.data.cve.map((el, index) => {
                return <ThreatField key={index} {...el} />
              })}
            </TableRow> : ""
          }
          {
            requestState.data.cwe.length || showEmptyFields ? <TableRow rowKey={"CWE"} tooltip={"https://cwe.mitre.org"}>
              {requestState.data.cwe.map((el, index) => {
                return <ThreatField key={index} {...el} />
              })}
            </TableRow> : ""
          }
          {
            requestState.data.software.length || showEmptyFields ? <TableRow rowKey={"SOFTWARE"} tooltip={"https://nvd.nist.gov/products/cpe"}>
              {requestState.data.software.map((el, index) => {
                return <Malware {...el} key={index} />
              })}
            </TableRow> : ""
          }
          {
            requestState.data.malware.length || showEmptyFields ? <TableRow rowKey={"MALWARE"} tooltip={"https://malpedia.caad.fkie.fraunhofer.de/families"}>
              {requestState.data.malware.map((el, index) => {
                return <Malware {...el} key={index} />
              })}
            </TableRow> : ""
          }
          {
            requestState.data.threatActor.length || showEmptyFields ? <TableRow rowKey={"THREAT_ACTOR"} tooltip={"https://malpedia.caad.fkie.fraunhofer.de/actors"}>
              {requestState.data.threatActor.map((el, index) => {
                return <ThreatField key={index} {...el} />
              })}
            </TableRow> : ""
          }
          {
            requestState.data.industry.length || showEmptyFields ? <TableRow rowKey={"INDUSTRY"} tooltip={"https://docs.oasis-open.org/cti/stix/v2.1/cs01/stix-v2.1-cs01.html#_oogrswk3onck"}>
              {requestState.data.industry.map((el, index) => {
                return <ThreatField key={index} {...el} />
              })}
            </TableRow> : ""
          }
          {requestState.data.mitreAattack.length || showEmptyFields ?
            <TableRow rowKey={"MITRE_ATTACK"} tooltip={"https://attack.mitre.org"}>
              {requestState.data.mitreAattack.map((el, index) => {
                return <ThreatField key={index} {...el} />
              })}
            </TableRow> : ""
          }
          {
            requestState.data.county.length || showEmptyFields ? <TableRow rowKey={"COUNTRY"}>
              {requestState.data.county.map((el, index) => {
                return <ThreatField key={index} {...el} />
              })}
            </TableRow> : ""
          }
          {requestState.data.city.length || showEmptyFields ?
            <TableRow rowKey={"CITY"}>
              {requestState.data.city.map((el, index) => {
                return <ThreatField key={index} {...el} />
              })}
            </TableRow> : ""
          }
          {requestState.data.timeStamp.length || showEmptyFields ?
            <TableRow rowKey={"TIMESTAMP"}>
              {requestState.data.timeStamp.map((el, index) => {
                return <ThreatField key={index} {...el} />
              })}
            </TableRow> : ""
          }
          {requestState.data.ioc || showEmptyFields ?
            <TableRow rowKey={"IOC"}>
              <Ioc {...requestState.data.ioc} />
            </TableRow> : ""
          }

          {/* <TableRow rowKey={"DOCUMENT"}>
            <div>{String(data.DOCUMENT}</div>
          </TableRow>
          <TableRow rowKey={"RATING"}>
            <div>{String(data.RATING}</div>
          </TableRow> */}
        </tbody>
      </table>}
      <TextField className="comment-field" label="Оставить комментарий" value={formik.values.comment} onChange={formik.handleChange("comment")} />
      <label className="report__result-label">Результат анализа отчета</label>
      <div className="report__result">
        <RadioInput inputId="no-threat"
          name="threatStatus"
          value="resolved"
          label="Угроз не обнаружено"
          checked={"resolved" === formik.values.checkStatus}
          onChange={formik.handleChange("checkStatus")} />
        <RadioInput inputId="threat"
          name="threatStatus"
          value="rejected"
          label="Обнаружена угроза"
          checked={"rejected" === formik.values.checkStatus}
          onChange={formik.handleChange("checkStatus")} />
        <RadioInput inputId="need-check"
          name="threatStatus"
          value="pending"
          label="Нужна проверка"
          checked={"pending" === formik.values.checkStatus}
          onChange={formik.handleChange("checkStatus")} />
      </div>
      <Button className="report-submit-btn" type="submit" onClick={() => formik.handleSubmit()}>Отправить отчет</Button>
    </div>
  )
}

export default Report
