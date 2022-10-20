import {io} from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'

function UserNotification(){
    const counters = [{id:1,name:"counter1"},{id:2,name:"counter2"}];//HERE SHOULD CALL THE GET SERVICE API
    const [response, setResponse] = useState([]);
    useEffect(() => {
      const socket = io("http://localhost:3001"/*,{
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }}*/);
      socket.on("connect",()=>{
        counters.forEach((counter)=>{
            console.log(counter.id-1)
            socket.on(counter.name, data => 
                !response[counter.id-1] ? 
                    setResponse(old=>[...old,data]) 
                        : response[counter.id-1]!==data ? 
                            setResponse(old => old[counter.id-1]=data) 
                                : '');
            console.log(response);
        })
      });
      return ()=>socket.disconnect();
    },[response]);
  
    return (<>
      <Table striped bordered hover>
        <thead>
            <tr>
                <th>#</th>
                <th>Counter Name</th>
                <th>Actual Number Served</th>
            </tr>
        </thead>
        <tbody>
            {counters ? 
                counters.map(counter=>
                    <CounterTable key={counter.id} id={counter.id} name={counter.name} actualNumber={response[counter.id-1]}/>
                )
                : ''
            }
        </tbody>
      </Table>
      </>);
  }

  function CounterTable(props){
    return <>
        <tr>
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.actualNumber ? props.actualNumber : " - "}</td>
        </tr>
    </>
  }
  export default UserNotification;