import React from 'react';
import '../styles/style.css'
import { Collapse } from 'antd';
import dayjs from 'dayjs';

const getParsedHistory = (changes) => {


  try {
    const string = changes.replace(/None/g, null).replace(/'/g, '"');
    return JSON.parse(string);
  } catch (e) {
    return []
  }
}

const Amendments = ({ history }) => {
  const amendments =
    (<div className="bottom-po">
      {history.map((history, index) => {
        const changes = getParsedHistory(history.changes);

        const show = changes.reduce((result, change) => {
          return Object.keys(change).map((key) => {
            if (Array.isArray(change[key][0])) {
              if (change[key][0][2] === "updated_on") {
                result = false;
              }
            } else {
              if (change[key][0] === "updated_on") {
                result = false;
              }
            }
            return result;
          })
        }, true);

        if (!show[0]) {
          return ''
        }

        return (
          <div key={index} className="top-data">
            <div className="dot-wrap">
              <div className="form-dot"><span></span></div>
              <div className="row left-wrap-space">
                <div className="col-lg-3 col-md-6">
                  <div className="inner-data">
                    <span className="small-span">Amendment On</span>
                    <span className="medium-span">{dayjs(history.changed_at).format('DD MMM YYYY')}</span>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="inner-data">
                    <span className="small-span">Amendment By</span>
                    <span className="medium-span">{history.changed_by?.first_name} {history.changed_by?.last_name}({history.changed_by?.user_role?.name})</span>
                  </div>
                </div>
              </div>
            </div>
            {
              changes?.map((change) => {
                return Object.keys(change).map((key) => {
                  let upperKey = '';
                  if (Array.isArray(change[key][0])) {
                    if (change[key][0][2] === "updated_on") {
                      return ''
                    }
                    if (change[key][0][0].includes('_')) {
                      upperKey = change[key][0][0].split('_').join(' ')
                    }
                  } else {
                    if (change[key][0] === "updated_on") {
                      return ''
                    }
                    if (change[key][0].includes('_')) {
                      upperKey = change[key][0].split('_').join(' ')
                    }
                  }

                  return (
                    <>
                      <div className="linewrap d-flex space-raw">
                        <span className="d-block me-2">{key.charAt(0).toUpperCase() + key.slice(1) + " " + upperKey}</span>
                        <hr />
                      </div>
                      {
                        key === 'change' && (
                          <>
                            <div className="row raw-data-btm">
                              <div className="col-lg-2 col-md-4">
                                <div className="inner-data">
                                  <span className="small-span">{change[key][1][0]}</span>
                                  <span className="medium-span"> {change[key][1][1]}</span>
                                  {/* <span className="small-span">{change[key][1][1]}</span>
                                                <span className='medium-span'>{data[key]}</span> */}
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      }
                      {
                        key === 'add' && (
                          <>
                            <div className="row raw-data-btm">
                              {
                                change[key][1][0]?.map((data, index) => {
                                  console.log(data, 'hhhhhhhhhdata')

                                  // return (
                                  //   <div className="col-lg-2 col-md-4">
                                  //     <div className="inner-data">
                                  //       {/* <span className="medium-span">{key.split('_').join(" ")}: {data[key]}</span> */}
                                  //       <span className="small-span">{key.split('_').join(" ")}</span>
                                  //       <span className='medium-span'>{data.quantity}</span>
                                  // <span className='medium-span'>{data.description}</span>
                                  //       <span className='medium-span'>{data.description}</span>
                                  //       {/* <span className='medium-span'>{data.description}</span> */}
                                  //     </div>
                                  //   </div>
                                  // )

                                  return Object.keys(data).map((key) => {
                                    if(data[key] && key !== "md_id" && key !== 'created_on' && key !== 'updated_on') {
                                      return <>
                                        <div className="col-lg-2 col-md-4">
                                          <div className="inner-data">
                                            {/* <span className="medium-span">{key.split('_').join(" ")}: {data[key]}</span> */}
                                            <span className="small-span">{key.split('_').join(" ")}</span>
                                            <span className='medium-span'>{data[key]}</span>
                                            {/* <span className='medium-span'>{data.description}</span> */}
                                          </div>
                                        </div>
                                      </>
                                    }
                                    <span className='medium-span'>{data[description]}</span>
                                    return <>


                                    </>
                                  })
                                })
                              }
                            </div>
                          </>
                        )
                      }
                    </>
                  )
                })
              })
            }
          </div>
        )
      })}
    </div>);

  const items = [
    {
      key: '1',
      label: 'Amendments',
      children: amendments
    }
  ];

  return <Collapse items={items} defaultActiveKey={['1']} />;
};

export default Amendments;