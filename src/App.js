import { useEffect, useReducer } from "react"


const initialState={
  questions:[],
  status:"Loading",
  index:0,
  emojis:"",
  answer:null,
  chose:null,

  marks:0,
  onetime :true,
  secondsRenaining:null,
  }


  


function reducer(state,action){
  
  switch(action.type){
    case "featchdata":
      return{...state,questions : action.payload};
    
      case "start":
        return{...state,status:"active"};
      
        case "nexquestion":
          return {...state, index: state.index+1,chose:null,onetime:true,emojis:" "};
      
          case "finshquestion":
          return {...state, status:"finsh",chose:null};
      
          case "right":
            return {...state, chose:true,emojis:"👍",onetime:false,marks:state.marks+10};
        
            case "wrong":
            return {...state, chose:true,emojis:"👎",onetime:false};
        
          
          case "restart":
          return {...state,onetime:true ,secondsRenaining:0,marks:0,emojis:" ", index:0,status:"Loading",chose:null};
      
          case "tick":
  return {...state,secondsRenaining:state.secondsRenaining+1,status:action.payload ===4 ?'finsh':state.status,}

            
          default:
        throw new Error("Action unkorwn")
      
    }
  
  }  
    
export default  function App(){
    const[{secondsRenaining,onetime,marks,emojis,questions,status,index,chose},dispatch]=useReducer(reducer,initialState)
   // const [emojis,setEmojis]=useState("")
  
    const questionsnumper=questions.length;    
    console.log(chose)
useEffect(function(){
        fetch("http://localhost:9000/questions")
        .then((res)=>res.json())
        .then((data)=> dispatch({type:'featchdata',payload:data}))
        .catch((err)=>dispatch({type:"dataFailed"}))
  
      
      },[])
      
 
 
 return <div className="basic-div">
  <Main>
  
  {status==="Loading"&&<Header/>}
  {status==="Loading"&&<StartScreen questionsnumper={questionsnumper} dispatch={dispatch} />}
  
  {status==="active"&&<Question  onetime={onetime} emojis={emojis} marks={marks}  questionsnumper={questionsnumper} chose={chose}  dispatch={dispatch} index={index}  questions={questions} question={questions[index]} />}
  {status==="active"&&<Timer dispatch={dispatch} secondsRenaining={secondsRenaining} />}
  {chose===true&&<NextButton status={status}   chose ={chose}index={index}  dispatch={dispatch}  />} 
  
  {chose===true &&<FinshButton status={status} index={index} dispatch={dispatch} />}
  
  {status==="finsh"&& <FinshScreen marks={marks} index={index} dispatch={dispatch} />}
  
  </Main>
 </div>
}

function Main({children}){

  return <div className="mian">
{children}
  </div>
}

function Header(){
  return     <header className='app-header'>
  <img src='logo.jpeg' alt='React logo' />
  <h1><em className="em-the">The</em> Software <em className="em-Quiz">Quiz</em></h1>
</header>

}



function StartScreen({questionsnumper,dispatch}){

  return <div className="start">
<h2>Welcome to The Software Quiz!  </h2>
<h3><em className="em-the">{questionsnumper}</em> questions to  test your Software mestery</h3>
  <button className="ui" onClick={()=>dispatch({type:"start"})} >Let`s start</button>
  </div>
}


function Question({question,onetime,questionsnumper,marks,emojis,questions,index,chose,dispatch}){

  return<div>
  <Progress questionsnumper={questionsnumper} index={index}/>
    <h3 className="h3-question"> {question.question}</h3>
 <Options question={question} onetime={onetime} emojis={emojis} marks={marks} questions={questions} dispatch={dispatch} chose={chose} index={index}/>
  
  </div>

  
}

function Progress({questionsnumper,index}){
  return<header className="progress">
   <h2>Welcome to The Software Quiz!  </h2>
  <progress max={questionsnumper}  value={index+1}/>
  <h4>{index}/{questionsnumper}<em>questions</em></h4>
</header>
 }





 function Options({question,onetime,marks,emojis,questions,index,chose,dispatch}){
   const correcOption= questions[index].correctOption
  //const [marks,setMarks]=useState(0)
  

   function hadilingwithanswer(id){
   
    if(id ===correcOption){ 
      if(onetime===true){
      dispatch({type:"right"})
      }
      //  setMarks(marks+10)

      
    
    
  }
      if(id !==correcOption)
      {
        dispatch({type:"wrong"})
        
      }
     
   
  }
  
  return (
    <div className="options">
<h2><em>{marks}/110 marks</em>   {emojis}</h2>

{question.options.map((opn,index)=><button onClick={()=>hadilingwithanswer(index)} className={chose ===true ?   (correcOption===index?"answer":"btn btn-option" || correcOption!==index?"wrong":"btn btn-option"):"btn btn-option"} key={opn}>{opn}</button>)}

    </div>
  )
 }

 

 function NextButton({dispatch,status,index,}){
 
  
  if(index<10 && status !=="finsh")
  return  <button className="btn btn-ui" onClick={()=>dispatch({type:"nexquestion"})} >Next</button>
  
  
  
  
  }

function FinshButton({status,dispatch,index}){
  if(index===10 && status !=="finsh")
  return  <button className="btn btn-ui" onClick={()=>dispatch({type:"finshquestion"})} >Finsh</button>
  
  
  
  
  }
 



 function  FinshScreen({dispatch,marks}){
  return <div>
    <p className="result">
{marks>55 &&"🫡Good Progress , Keep Going Until You Get Full Marks"}
{marks>75 &&"😁Excellent Progress Now Prepare For The Next Exam"}
{marks<=50 &&" 😥Not Bad Progress , Keep Going Until You Get Full Marks"}

    </p>
    <p className="highscore">(Highscore: {marks}/110 points)</p>
    <button className="btn btn-ui" onClick={()=>dispatch({type:"restart"})} >Restart quiz</button>
</div>
 }





//
function Timer({dispatch,secondsRenaining}){
  const mins=Math.floor(secondsRenaining /60)
  const seconds= secondsRenaining %60;   
  
  useEffect(function(){
    const id =setInterval(function(){
      dispatch({type:'tick',payload:mins})
  },1000);
  return ()=> clearInterval(id);
  
      },[dispatch,mins])
  return (
  
  <div className="timer">{mins <10 &&"0"}{mins}:{seconds <10 &&"0"}{seconds}</div>
  
  
  )
  
  }