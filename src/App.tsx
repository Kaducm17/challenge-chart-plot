import React, { useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import Header from './components/Header'
import Chart from "react-apexcharts";
import Footer from './components/Footer';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2'


import 'bootstrap/dist/css/bootstrap.min.css';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-dracula";
import { useStateWithPromise } from './utils/UseStateWithPromise';

interface formatedCodeProps extends Object {
  type: string,
  timestamp: number,
  select?: Array<string>,
  group?: Array<string>,
  os?: string,
  browser?: string,
  min_response_time?: number,
  max_response_time?: number
  begin?: number
  end?: number
}


function App() {
  const [code, setCode] = useState<any>()
  const [start, setStart] = useStateWithPromise<any>({})
  const [span, setSpan] = useStateWithPromise<any>({})
  const [stop, setStop] = useStateWithPromise<any>()
  const [data, setData] = useStateWithPromise<Array<Object> | any>([])

  useEffect(() => {
    Swal.fire({
      title: 'Copy / Paste and Have Fun',
      html: `<pre><code> 
{type: 'start', timestamp: 1519780251293, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 1519780251293, begin: 1519780251293, end: 1519780260201}
{type: 'data', timestamp: 1519780251293, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.8}
{type: 'data', timestamp: 1519780251293, os: 'macOs', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.1}
{type: 'data', timestamp: 1519780251293, os: 'windows', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.9}
{type: 'data', timestamp: 1519780251000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.4}
</code></pre>
      `
    })


  }, [])

  const createChartData = () => {
    const filteredArray: Array<any> = data.filter((value: any) => {
      return value.timestamp >= span.begin && value.timestamp <= span.end
    })

    const chartArray: Array<any> = []

    filteredArray.forEach((value) => {
      chartArray.push({
        name: `${value.os} ${value.browser} Max and Min Response Time`,
        data: [value.min_response_time, value.max_response_time]
      })
    })
   
    return chartArray
  }

  const checkEventType = (codeArray: Array<formatedCodeProps>) => {
    const data: any = []
    codeArray.forEach(async (code, index) => {
       // Check if has property 'type' because is mandatory. Alert user otherwise 
      if (!code.hasOwnProperty('type')) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Any of your events does not have a property type or your object is not valid!',
        })
      }
      else {
        if (code.type === 'start') {
          if (code.hasOwnProperty('select') && code.hasOwnProperty('group')) {
            await setStart({ select: code.select, group: code.group })
          }
          else {
            return Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Your start does not have select and group properties or your object is not valid!',
            })
          }
        }

        if (code.type === 'span') {
          if (code.hasOwnProperty('begin') && code.hasOwnProperty('end')) {
            await setSpan({ begin: code.begin, end: code.end })
          }
          else {
            return Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Your start does not have begin and end properties or your object is not valid!',
            })
          }
        }

        if (code.type === 'stop') {
          await setStop(index)
        }

        if (code.type === 'data') {
          if (stop !== null) {
            if ((code.hasOwnProperty('os') || code.hasOwnProperty('browser')) && (code.hasOwnProperty('min_response_time') || code.hasOwnProperty('max_response_time'))) {
              data.push({
                os: code.os,
                browser: code.browser,
                timestamp: code.timestamp,
                min_response_time: code.min_response_time,
                max_response_time: code.max_response_time
              })
            }
            else {
              return Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your data does not have essentials properties or your object is not valid!',
              })
            }
          }
        }
      }
      // condition created to protect the application when dealing with large amounts of data
      if(data.length <= 20) {
        await setData(data)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Data is too big, delete some data and try again!',
        })
        await setData([])
      }
    }
    )
  }

  const formatJson = (value) => {
    return value.trim().split('\n');
  }
  // Function to remove any special character to parse correctly later
  const formatArrayData = (data) => {
    return ((((data.replaceAll('\'', '"')).replaceAll('{', '{"')).replaceAll(':', '":')).replaceAll(', ', ', "')).replaceAll('""', '"')
  }

  const parseCodeToJSONArray = () => {
    const perfectCode = formatJson(code)
    const codeArray: any = []

    perfectCode.forEach((code) => {
      codeArray.push(formatArrayData(code))
    })

    return codeArray.map(JSON.parse)
  }

  const onGenerateChart = () => {
    checkEventType(parseCodeToJSONArray())
    createChartData()
  }

  const config = {
    series: createChartData(),
    options: {
      legend: {
        position: 'right'
      },
      chart: {
        toolbar: {
          show: false
        },
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      grid: {
        padding: {
          left: 30,
          right: 30
        },
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['00:00', '00:01'],
        format: 'fff',

      },
      yaxis: {
        show: false
      }
    },
  };

  return (
    <div className="App">
      <Header name='Kadu' />

      <div
        id="textArea"
      >
        <AceEditor
          style={{
            boxSizing: 'border-box',
            fontFamily: '"Dank Mono", "Fira Code", monospace',
            width: '100%',
            height: '250px',
            resize: 'vertical',
            overflow: 'auto',
          }}
          showPrintMargin={false}
          className="editor"
          mode="javascript"
          theme="dracula"
          onChange={value => setCode(value)}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
      </div>
      <hr />

      <Chart options={config.options} series={config.series} type="line" width="100%" height='200px' />

      <Footer>
        <Button variant="primary" onClick={onGenerateChart}>Generate Chart</Button>
      </Footer>

    </div>
  );
}

export default App
