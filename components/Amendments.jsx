import React from 'react';
import '../styles/style.css'
import { Collapse } from 'antd';
import dayjs from 'dayjs';

const jsonParse = (string) => {
  try {
    const updatedString = string.replace(/'/g, '"').replace(/True/g, 'true');
    return Object.values(JSON.parse(updatedString)).filter((value) => typeof value !== 'boolean').join(', ');
  } catch(e) {
    return ''
  }
}

const Amendments = ({ history }) => {

  const amendments =
    (<div className="bottom-po">
      {history.map((history, index) => {
        const changes = history.changes;

        const show = changes.map((change, index) => {
          return Object.keys(change).reduce((result, key) => {
            if (Array.isArray(change[key][0])) {
              if (change[key][0][2] === "updated_on" || change[key][0][2] === 'md_id') {
                result = false;
              } else {
                result = true;
              }
            } else {
              if (typeof change[key][0] === 'undefined' || change[key][0] === "updated_on") {
                result = false;
              } else {
                result = true;
              }
            }
            return result;
          }, true)
        })

        if(!show.some(value => value === true)) {
          return ''
        }
        
        return (
          <div key={index} className="top-data">
            <div className="dot-wrap">
              <div className="form-dot"><span></span></div>
              <div className="row left-wrap-space">
                <div className="col-lg-4 col-md-6">
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

                        if (change[key][0][2] === "updated_on" || change[key][0][2] === 'md_id' || change[key][0][2] === 'material_details') {
                          return ''
                        }
                        if(change[key][0][2].includes('amount') || change[key][0][2].includes('price')) {
                          change[key][1][1] = change[key][1][1].toFixed(2);
                        }
                        if (change[key][0][2].includes('_')) {
                          upperKey = change[key][0][2].split('_').join(' ').charAt(0).toUpperCase() + change[key][0][2].split('_').join(' ').slice(1)
                        } else {
                          upperKey = change[key][0][2].charAt(0).toUpperCase() + change[key][0][2].slice(1)
                        }
                        if(change[key][0][2] === 'project_site') {
                          change[key][1][1] = jsonParse(change[key][1][1])
                        }
                        if(change[key][0][2] === 'created_on'){
                          let createdOnDate = new Date(change[key][1][1]);
                          let formattedDate = `${createdOnDate.getFullYear()}-${(createdOnDate.getMonth() + 1).toString().padStart(2, '0')}-${createdOnDate.getDate().toString().padStart(2, '0')}`;
                          change[key][1][1] = formattedDate;
                        }
                      } else {
                        if (typeof change[key][0] === 'undefined' || change[key][0] === "updated_on" || change[key][0] === 'material_details') {
                          return ''
                        }
                        if (change[key][0]?.includes('.')) {
                          if(change[key][0].split('.')[0] !== 'updated_by' && change[key][0].split('.')[1] !== 'project_no') {
                            change[key][0] = change[key][0].split('.')[0] + " " + change[key][0].split('.')[1]
                          } else {
                            change[key][0] = change[key][0].split('.')[1]
                          }
                        }
                        if(change[key][0].includes('amount')) {
                          change[key][1][1] = change[key][1][1].toFixed(2);
                        }
                        if(change[key].includes('first_name') || change[key].includes('last_name') || change[key].includes('email')){
                          return ''
                        }
                        if (change[key][0]?.includes('_')) {
                          upperKey = change[key][0].split('_').join(' ').charAt(0).toUpperCase() + change[key][0].split('_').join(' ').slice(1)
                        } else {
                          upperKey = change[key][0].charAt(0).toUpperCase() + change[key][0].slice(1)
                        }
                      }
                      return (
                        <>
                          {key === 'change' && (<div className="col-lg-4 col-md-6">
                            <div className="inner-data">
                              <span className="small-span">{upperKey}</span>
                              <span className="medium-span"> {change[key][1][1]}</span>
                            </div>
                          </div>)}
                            {
                              key === 'add' && (
                                <>
                                    {
                                      change[key][1][0]?.map((data) => {
                                        return Object.keys(data).map((key) => {
                                          if (data[key] && key !== "md_id" && key !== 'created_on' && key !== 'updated_on' && key !== 'purchase_order') {
                                            return <>
                                              <div className="col-lg-2 col-md-4">
                                                <div className="inner-data">
                                                  <span className="small-span">{key.split('_').join(" ")}</span>
                                                  <span className='medium-span'>{data[key]}</span>
                                                </div>
                                              </div>
                                            </>
                                          }
                                          return <></>
                                        })
                                      })
                                    }
                                </>
                              )
                            }
                        </>
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

export default React.memo(Amendments);