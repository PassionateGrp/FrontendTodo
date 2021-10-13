import React, {useState} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import _ from "lodash";
import './App.css';
import {v4} from "uuid";
// import { logDOM } from '@testing-library/dom';

const item = {
  id:v4(),
  task:"lab completed"
}
const item2 = {
  id:v4(),
  task:"lab22 completed"
}

const initialState = {
  "todo":{
    title:"todo",
    items:[item,item2]
  },
  "in-progress":{
    title:"in-progress",
    items:[]
  },
  "done":{
    title:"completed",
    items:[]
  }
}


function App() {
  const [text,setText] = useState("")
  const [state,setState] = useState(initialState)

  const handleDragEnd = ({destination,source})=>{
    if(!destination){
      return
    }
    if(destination.index === source.index && destination.draggableId === source.draggableId){
      return
    }
    const itemCopy = {...state[source.droppableId].items[source.index]}
    setState(prev => {
      prev = {...prev}
      prev[source.droppableId].items.splice(source.index,1)
      prev[destination.droppableId].items.splice(destination.index,0,itemCopy)
      return prev
    })
  }
  const addItem = ()=>{
      if(text){
        setState(prev => {
          return {
           ...prev,
           todo:{
             title:"todo",
             items:[{
               id:v4(),
               task:text
             },...prev.todo.items]
          } 
   
           }
         })
         setText("")
      }
      
  }

  return (
    <div className="App">
    <div className="add">
      <input type="text" value={text} onChange={(e)=>{setText(e.target.value)}}/>
      <button onClick={addItem}>+</button>
    </div>
    <div className="main">
     <DragDropContext onDragEnd={handleDragEnd}>
      {_.map(state, (data,key)=>{
        return(
          <div key={key} className={"column"}>
          <h3>{data.title}</h3>
          <Droppable droppableId={key}>
            {(provided)=>{
              return(
                <div ref={provided.innerRef}
                {...provided.droppableProps}
                className={"droppable-col"}
                >
                {data.items.map((el,index)=>{
                  return(
                    <Draggable key={el.id} index={index} draggableId={el.id}>
                      {(provided,snapshot)=>{
                        return(
                          <div ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`item ${snapshot.isDragging && "drag"}`}
                          >
                            {el.task}
                          </div>
                        )
                      }}
                    </Draggable>
                  )    
                })}
                  {provided.placeholder}
                  
                </div>
              )
            }}
          </Droppable>
          </div>
        )
      })}
     </DragDropContext>
     </div>
    </div>
  );
}

export default App;
