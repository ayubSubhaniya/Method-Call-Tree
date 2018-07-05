/* eslint-disable rule */
import React, { Component } from 'react';
import data from './treeData.json';
import {
  SortableTreeWithoutDndContext as SortableTree,
  toggleExpandedForAll,
} from '../../src/index';
import './stylesheets/vendor/stylesheet.css';
import './stylesheets/vendor/github-light.css';
import './stylesheets/app.css';
import '../shared/favicon/apple-touch-icon.png';
import '../shared/favicon/favicon-16x16.png';
import '../shared/favicon/favicon-32x32.png';
import '../shared/favicon/favicon.ico';
import '../shared/favicon/safari-pinned-tab.svg';
import {nodeAtIndex} from './../../src/utils/tree-data-utils'


const HOST_NAME = "http://localhost"
const PORT = "8081"
const url = HOST_NAME+":"+PORT+"/analyseMethod"

const stackTraceKeyName="stackTrace"
const previousChannelKeyName="previousChannel"
const previousDepthKeyName="previousDepth"
const currentFlowKeyName="currentFlow"
const previousRootClassNameKey="previousRootClassName"
const previousRootMethodNameKey="previousRootMethodName"
const previousRootMethodParameterKey="previousRootMethodParameter"
const previousRootstackTraceInfoKey="previousRootstackTraceInfo"
const previousAllowedChunkScoreKey="previousAllowedChunkScore"
const maxDepth = 100;

let previousStackTrace = JSON.parse(window.sessionStorage.getItem(stackTraceKeyName))
let previousChannel = window.sessionStorage.getItem(previousChannelKeyName)
let previousDepth = window.sessionStorage.getItem(previousDepthKeyName)
let currentFlow = window.sessionStorage.getItem(currentFlowKeyName)
let previousRootClassName = JSON.parse(window.sessionStorage.getItem(previousRootClassNameKey))
let previousRootMethodName = JSON.parse(window.sessionStorage.getItem(previousRootMethodNameKey))
let previousRootMethodParameter = JSON.parse(window.sessionStorage.getItem(previousRootMethodParameterKey))
let previousRootstackTraceInfo = JSON.parse(window.sessionStorage.getItem(previousRootstackTraceInfoKey))
let previousAllowedChunkScore = window.sessionStorage.getItem(previousAllowedChunkScoreKey)

const publishingRestApiFlow = 'publishingRestApiFlow'
const posterJobFlow = 'posterJobFlow'
const baseSprJobFlow = 'baseSprJobFlow'
const outboundPreProcessorFlow = 'outboundPreprocessorJobFlow'

const defaultFlow = publishingRestApiFlow
const defaultChannel = ''
class App extends Component {
  constructor(props) {
    super(props);

    const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

    if (previousRootClassName==null)
      previousRootClassName = []

    if (previousRootMethodName==null)
      previousRootMethodName = []

    if (previousRootMethodParameter==null)
      previousRootMethodParameter = []

    if (previousRootstackTraceInfo==null)
      previousRootstackTraceInfo = []

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: data,
      maxDepth: (previousDepth!=null?previousDepth:10),
      flow:(currentFlow!=null?currentFlow:''),
      channelName:(previousChannel!=null?previousChannel:null),
      className : previousRootClassName.length>0?previousRootClassName[previousRootClassName.length-1]:'',
      methodName : previousRootMethodName.length>0?previousRootMethodName[previousRootMethodName.length-1]:'',
      methodParameter : previousRootMethodParameter.length>0?previousRootMethodParameter[previousRootMethodParameter.length-1]:'',
      stackTraceInfo : previousRootstackTraceInfo.length>0?previousRootstackTraceInfo[previousRootstackTraceInfo.length-1]:'',
      allowedChunkScore : previousAllowedChunkScore!=null&&previousAllowedChunkScore!='null'?previousAllowedChunkScore:0,
    };

    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
  }

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  render() {
    const projectName = 'Method Analysis';
    const authorName = '';
    const authorUrl = '';
    const githubUrl = '';

    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
      channelName,
      maxDepth,
      flow,
      className,
      methodParameter,
      methodName,
      stackTraceInfo,
      allowedChunkScore
    } = this.state;


    /*
    * Change path sequence to method call name
    */
    const alertNodeInfo = ({ node, path, treeIndex }) => {
      var stackTrace=[]
      let minus=(previousStackTrace!=null&&previousStackTrace.length>0)?1:0
      for (let i=path.length-1;i>=0+minus;i--){
          stackTrace.push(nodeAtIndex[path[i]])
      }
      if (previousStackTrace!=null){
        for (let i=0;i<previousStackTrace.length;i++)
          stackTrace.push(previousStackTrace[i])
      }
      
      const tempElement = document.createElement('textarea')
      tempElement.value=stackTrace.join('\n')
      document.body.appendChild(tempElement)
      tempElement.select()
      document.execCommand('copy')
      global.alert("Copied stacktrace to clipboard")
      document.body.removeChild(tempElement)
    };

    const changeRoot = ({ node, path, treeIndex }) => {

      var {channelName, maxDepth, flow} = this.state;
      
      if (channelName==null || channelName.length==0 || maxDepth==null){
        global.alert("channel name required")
        return;
      }

      if (previousRootClassName==null){
        previousRootClassName=[node.className]
        window.sessionStorage.setItem(previousRootClassNameKey,JSON.stringify(previousRootClassName))
      } else {
        previousRootClassName.push(node.className)
        window.sessionStorage.setItem(previousRootClassNameKey,JSON.stringify(previousRootClassName))
      }

      if (previousRootMethodName==null){
        previousRootMethodName=[node.methodName]
        window.sessionStorage.setItem(previousRootMethodNameKey,JSON.stringify(previousRootMethodName))
      } else {
        previousRootMethodName.push(node.methodName)
        window.sessionStorage.setItem(previousRootMethodNameKey,JSON.stringify(previousRootMethodName))
      }

      if (previousRootMethodParameter==null){
        previousRootMethodParameter=[node.methodParameter]
        window.sessionStorage.setItem(previousRootMethodParameterKey,JSON.stringify(previousRootMethodParameter))
      } else {
        previousRootMethodParameter.push(node.methodParameter)
        window.sessionStorage.setItem(previousRootMethodParameterKey,JSON.stringify(previousRootMethodParameter))
      }
  
      if (previousRootstackTraceInfo==null){
        previousRootstackTraceInfo=[node.stackTraceInfo]
        window.sessionStorage.setItem(previousRootstackTraceInfoKey,JSON.stringify(previousRootstackTraceInfo))
      } else {
        previousRootstackTraceInfo.push(node.stackTraceInfo)
        window.sessionStorage.setItem(previousRootstackTraceInfoKey,JSON.stringify(previousRootstackTraceInfo))
      }
      
      var stackTrace=[]
      let minus=(previousStackTrace!=null&&previousStackTrace.length>0)?1:0
      
      for (let i=path.length-1;i>=0+minus;i--){
          stackTrace.push(nodeAtIndex[path[i]])
      }
      if (previousStackTrace!=null){
        for (let i=0;i<previousStackTrace.length;i++)
          stackTrace.push(previousStackTrace[i])
      }
      this.state.className=node.className
      this.state.methodName=node.methodName
      this.state.methodParameter=node.methodParameter
      window.sessionStorage.setItem(stackTraceKeyName,JSON.stringify(stackTrace))
      generateTree.call()
    };

    const moveToPreviousRoot = ()=>{

      var {channelName, maxDepth, flow} = this.state;
      
      if (channelName==null || channelName.length==0 || maxDepth==null){
        global.alert("channel name required")
        return;
      }

      //console.log("hi")
      if (previousRootClassName.length>0){
        //console.log("hi2")
        previousRootClassName=previousRootClassName.slice(0,previousRootClassName.length-1)
        previousRootMethodName=previousRootMethodName.slice(0,previousRootMethodName.length-1)
        previousRootMethodParameter=previousRootMethodParameter.slice(0,previousRootMethodParameter.length-1)
        previousRootstackTraceInfo=previousRootstackTraceInfo.slice(0,previousRootstackTraceInfo.length-1)
        //console.log("hi3")
        if (previousRootClassName.length>0){
          this.state.className=previousRootClassName[previousRootClassName.length-1]
          this.state.methodName=previousRootMethodName[previousRootMethodName.length-1]
          this.state.methodParameter=previousRootMethodParameter[previousRootMethodParameter.length-1]
          const laststackTraceInfo=previousRootstackTraceInfo[previousRootstackTraceInfo.length-1]
          //console.log("hi4")
          var stackTrace=previousStackTrace
          for (let i=0;i<stackTrace.length;i++){
              if (stackTrace[i]==laststackTraceInfo){
                stackTrace=stackTrace.slice(i,stackTrace.length)
                break;
              }
          }
          //console.log("hi5")
          window.sessionStorage.setItem(stackTraceKeyName,JSON.stringify(stackTrace))
        } else {
          this.state.className=''
          this.state.methodName=''
          this.state.methodParameter=''
          var stackTrace=[] 
          window.sessionStorage.setItem(stackTraceKeyName,JSON.stringify(stackTrace))
        }
        window.sessionStorage.setItem(previousRootClassNameKey,JSON.stringify(previousRootClassName))
        window.sessionStorage.setItem(previousRootMethodNameKey,JSON.stringify(previousRootMethodName))
        window.sessionStorage.setItem(previousRootMethodParameterKey,JSON.stringify(previousRootMethodParameter))
        window.sessionStorage.setItem(previousRootstackTraceInfoKey,JSON.stringify(previousRootstackTraceInfo))
        
      } else {
        this.state.className=''
        this.state.methodName=''
        this.state.methodParameter=''
        var stackTrace=[] 
        window.sessionStorage.setItem(stackTraceKeyName,JSON.stringify(stackTrace))
      }
      //console.log("hi6")
      generateTree.call()
      //console.log("hi7")
    }

    const selectPrevMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1,
      });

    const selectNextMatch = () =>
      this.setState({
        searchFocusIndex:
          searchFocusIndex !== null
            ? (searchFocusIndex + 1) % searchFoundCount
            : 0,
      });

    const generateTree = () => {

      var {methodParameter,className, methodName} = this.state;
      
      if (methodParameter.length>0&&className.length>0&&methodName.length>0){
        methodParameter=methodParameter.trimLeft()
        className=className.trimLeft()
        methodName=methodName.trimLeft()
        methodParameter="'"+methodParameter+"'";
        methodName="'"+methodName+"'"
      } 
      //console.log("t1")
      var {channelName, maxDepth, flow, allowedChunkScore} = this.state;
      
      if (channelName==null || channelName.length==0 || maxDepth==null){
        global.alert("channel name required")
        return;
      }
      else{
        channelName=channelName.trimLeft().toLowerCase()
      }
      //console.log("t2")
      if (channelName.length>0){
        window.sessionStorage.setItem(previousChannelKeyName,channelName)
      }

      if (maxDepth.length>0){
        window.sessionStorage.setItem(previousDepthKeyName,maxDepth)
      }

      if (allowedChunkScore.length>0){
        window.sessionStorage.setItem(previousAllowedChunkScoreKey,allowedChunkScore)
      }
      //console.log("t3")
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open("PUT", url, true);
      xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            
        }
      };
      
      //console.log("t4")
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xmlhttp.send(JSON.stringify({
        className,
        methodName,
        methodParameter,
        channelName,
        maxDepth,
        flow, 
        allowedChunkScore
      }));
    }

    const viewpublishingRestApiFlow= () => {
      if (channelName==null || channelName.length==0 || maxDepth==null){
        global.alert("channel name required")
        return;
      }
      this.state.flow=publishingRestApiFlow
      const stackTrace=[]
      previousRootClassName=[]
      previousRootMethodName=[]
      previousRootMethodParameter=[]
      previousRootstackTraceInfo=[]
      window.sessionStorage.setItem(previousRootClassNameKey,JSON.stringify(previousRootClassName))
      window.sessionStorage.setItem(previousRootMethodNameKey,JSON.stringify(previousRootMethodName))
      window.sessionStorage.setItem(previousRootMethodParameterKey,JSON.stringify(previousRootMethodParameter))
      window.sessionStorage.setItem(previousRootstackTraceInfoKey,JSON.stringify(previousRootstackTraceInfo))
      window.sessionStorage.setItem(stackTraceKeyName,JSON.stringify(stackTrace))
      window.sessionStorage.setItem(currentFlowKeyName,publishingRestApiFlow)
      generateTree.call()
    }

    const viewBaseSprJobFlow = () => {
      if (channelName==null || channelName.length==0 || maxDepth==null){
        global.alert("channel name required")
        return;
      }
      this.state.flow=baseSprJobFlow
      const stackTrace=[]
      previousRootClassName=[]
      previousRootMethodName=[]
      previousRootMethodParameter=[]
      previousRootstackTraceInfo=[]
      window.sessionStorage.setItem(previousRootClassNameKey,JSON.stringify(previousRootClassName))
      window.sessionStorage.setItem(previousRootMethodNameKey,JSON.stringify(previousRootMethodName))
      window.sessionStorage.setItem(previousRootMethodParameterKey,JSON.stringify(previousRootMethodParameter))
      window.sessionStorage.setItem(previousRootstackTraceInfoKey,JSON.stringify(previousRootstackTraceInfo))
      window.sessionStorage.setItem(stackTraceKeyName,JSON.stringify(stackTrace))
      window.sessionStorage.setItem(currentFlowKeyName,baseSprJobFlow)
      generateTree.call()
  }

  const viewOutboundPreProcessorFlow = () => {
    if (channelName==null || channelName.length==0 || maxDepth==null){
      global.alert("channel name required")
      return;
    }
    this.state.flow=outboundPreProcessorFlow
    const stackTrace=[]
    previousRootClassName=[]
    previousRootMethodName=[]
    previousRootMethodParameter=[]
    previousRootstackTraceInfo=[]
    window.sessionStorage.setItem(previousRootClassNameKey,JSON.stringify(previousRootClassName))
    window.sessionStorage.setItem(previousRootMethodNameKey,JSON.stringify(previousRootMethodName))
    window.sessionStorage.setItem(previousRootMethodParameterKey,JSON.stringify(previousRootMethodParameter))
    window.sessionStorage.setItem(previousRootstackTraceInfoKey,JSON.stringify(previousRootstackTraceInfo))
    window.sessionStorage.setItem(stackTraceKeyName,JSON.stringify(stackTrace))
    window.sessionStorage.setItem(currentFlowKeyName,outboundPreProcessorFlow)
    generateTree.call()
  }

    const viewPosterJobFlow = () => {
      if (channelName==null || channelName.length==0 || maxDepth==null){
        global.alert("channel name required")
        return;
      }
      this.state.flow=posterJobFlow
      const stackTrace=[]
      previousRootClassName=[]
      previousRootMethodName=[]
      previousRootMethodParameter=[]
      previousRootstackTraceInfo=[]
      window.sessionStorage.setItem(previousRootClassNameKey,JSON.stringify(previousRootClassName))
      window.sessionStorage.setItem(previousRootMethodNameKey,JSON.stringify(previousRootMethodName))
      window.sessionStorage.setItem(previousRootMethodParameterKey,JSON.stringify(previousRootMethodParameter))
      window.sessionStorage.setItem(previousRootstackTraceInfoKey,JSON.stringify(previousRootstackTraceInfo))
      window.sessionStorage.setItem(stackTraceKeyName,JSON.stringify(stackTrace))
      window.sessionStorage.setItem(currentFlowKeyName,posterJobFlow)
      generateTree.call()
  }

    const isVirtualized = true;
    const treeContainerStyle = isVirtualized ? { height: 650 , width : 950} : {};

    return (
      <div>
        <section className="page-header">
          <h1 className="project-name">{projectName}</h1>

        </section>
        <section>
        <form className='form-content'>
          Channel Name:
          <input className='form-element' type="text" name="className"
           value={channelName}
           onChange={event =>
             this.setState({ channelName: event.target.value })
           }/>
         Max Depth:
           <input type="number" className='maxdepth' name="maxDepth"
           value={maxDepth}
          onChange={event =>
            this.setState({ maxDepth: event.target.value })
          }/>

          Min Churn Score:
           <input type="number" className='maxdepth' name="chunkScore"
           value={allowedChunkScore}
          onChange={event =>
            this.setState({ allowedChunkScore: event.target.value })
          }/>
          
            <button onClick={viewpublishingRestApiFlow} type="button" ><b>View PublishingRestApi Flow</b></button>
            <button onClick={viewOutboundPreProcessorFlow} type="button" ><b>View OutboundPreProcessor Flow</b></button>
            <button onClick={viewPosterJobFlow} type="button" ><b>View PosterJob Flow</b></button>
            <button onClick={viewBaseSprJobFlow} type="button" ><b>View BaseSprJob Flow</b></button>
            <button onClick={moveToPreviousRoot} type="button"><b>Root tree to previous root</b></button>
        </form>
        </section>

        <section>
          <div className='type_of_method'><b>Type of method</b></div>
          <div className='color_scheme'>
          <div className='rst_interfaceMethod'>Implementation of InterfaceMethod</div>
          <div className='rst_overidedMethod'>OverridedMethod</div>
          <div className='rst_inheritedMethod'>InheritedMethod</div>
          </div>
        </section>

        <section className="main-content">
          <button onClick={this.expandAll}>Expand All</button>
          <button onClick={this.collapseAll}>Collapse All</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form
            style={{ display: 'inline-block' }}
            onSubmit={event => {
              event.preventDefault();
            }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                id="find-box"
                type="text"
                value={searchString}
                onChange={event =>
                  this.setState({ searchString: event.target.value })
                }
              />
            </label>

            <button
              type="button"
              disabled={!searchFoundCount}
              onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
              type="submit"
              disabled={!searchFoundCount}
              onClick={selectNextMatch}
            >
              &gt;
            </button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </form>
          <div style={treeContainerStyle}>
            <SortableTree
              treeData={treeData}
              onChange={this.updateTreeData}
              onMoveNode={({ node, treeIndex, path }) =>
                global.console.debug(
                  'node:',
                  node,
                  'treeIndex:',
                  treeIndex,
                  'path:',
                  path
                )
              }
              maxDepth={maxDepth}
              searchQuery={searchString}
              searchFocusOffset={searchFocusIndex}
              canDrag={({ node }) => !node.noDragging}
              canDrop={({ nextParent }) =>
                !nextParent || !nextParent.noChildren
              }
              searchFinishCallback={matches =>
                this.setState({
                  searchFoundCount: matches.length,
                  searchFocusIndex:
                    matches.length > 0 ? searchFocusIndex % matches.length : 0,
                })
              }
              isVirtualized={isVirtualized}
              generateNodeProps={rowInfo => ({
                buttons: [
                  <button
                    style={{
                      verticalAlign: 'middle',
                    }}
                    onClick={() => alertNodeInfo(rowInfo)}
                  >
                    Stack Trace
                  </button>,
                  <button
                  style={{
                    verticalAlign: 'middle',
                  }}
                  onClick={() => changeRoot(rowInfo)}
                >
                  Root Tree Here
                </button>,
                ],
              })}
            />
          </div>
          <br />

        </section>


      </div>
    );
  }
}

export default App;