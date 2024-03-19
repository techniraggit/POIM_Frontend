import React from 'react';
import '../styles/style.css'
import { Collapse } from 'antd';
import dayjs from 'dayjs';

const Amendments = ({ history }) => {

  const amendments =
    (<div className="bottom-po">
      {history.map((history, index) => {
        const changes = history.changes;

        const show = changes.reduce((result, change) => {
          return Object.keys(change).map((key) => {
            if (Array.isArray(change[key][0])) {
              if (change[key][0][2] === "updated_on") {
                result = false;
              } else {
                result = true
              }
            } else {
              if (change[key][0] === "updated_on") {
                result = false;
              } else {
                result = true
              }
            }
            return result;
          })
        }, true);

        // if(!show[0]) {
        //   return ''
        // }

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
                {
                  changes?.map((change) => {
                    return Object.keys(change).map((key) => {
                      let upperKey = '';
                      if (Array.isArray(change[key][0])) {

                        if (change[key][0][2] === "updated_on" || change[key][0][2] === 'project_site' || change[key][0][2] === 'md_id') {
                          return ''
                        }
                        if (change[key][0][2].includes('_')) {
                          upperKey = change[key][0][2].split('_').join(' ').charAt(0).toUpperCase() + change[key][0][2].split('_').join(' ').slice(1)
                        } else {
                          upperKey = change[key][0][2].charAt(0).toUpperCase() + change[key][0][2].slice(1)
                        }
                      } else {
                        if (typeof change[key][0] === 'undefined' || change[key][0] === "updated_on") {
                          return ''
                        }
                        if (change[key][0]?.includes('.')) {
                          change[key][0] = change[key][0].split('.')[1]
                        }
                        if (change[key][0]?.includes('_')) {
                          upperKey = change[key][0].split('_').join(' ').charAt(0).toUpperCase() + change[key][0].split('_').join(' ').slice(1)
                        } else {
                          upperKey = change[key][0].charAt(0).toUpperCase() + change[key][0].slice(1)
                        }
                      }
                      return (
                        // <div className='row'>
                          <div className="col-lg-4 col-md-6">
                            <div className="inner-data">
                              <span className="small-span">{upperKey}</span>
                              <span className="medium-span">
                                {
                                  key === 'change' && (
                                    <>
                                      <div className="row raw-data-btm">
                                        <div className="col-lg-2 col-md-4">
                                          <div className="inner-data">
                                            {/* <span className="small-span">{change[key][1][0]}</span> */}
                                            <span className="medium-span"> {change[key][1][1]}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                }
                              </span>
                            </div>
                            <div className="inner-data">
                              {/* <span className="small-span">{upperKey}</span> */}
                              <span className="medium-span">
                                {
                                  key === 'add' && (
                                    <>
                                      {
                                        change[key][1][0]?.map((data, index) => {
                                          return Object.keys(data).map((key) => {
                                            if (data[key] && key !== "md_id" && key !== 'created_on' && key !== 'updated_on' && key !== 'purchase_order' && key !== 'project_site') {
                                              return <>
                                                <div className="row raw-data-btm">
                                                  <div className="col-lg-2 col-md-4">
                                                    <div className="inner-data">
                                                      <span className="small-span">{key.split('_').join(" ")}</span>
                                                      <span className='medium-span'>{data[key]}</span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            }
                                            // <span className='medium-span'>{data['description']}</span>
                                            return <></>
                                          })
                                        })
                                      }
                                    </>
                                  )
                                }
                              </span>
                            </div>
                          </div>
                        // </div>
                      )
                    })
                  })

                }
              </div>
            </div>
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