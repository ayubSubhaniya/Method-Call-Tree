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

const maxDepth = 30;
const HOST_NAME = "http://localhost"
const PORT = "8081"
const url = HOST_NAME+":"+PORT+"/analyseMethod"

const scheduleFlow = 'schedule'
const posterJobFlow = 'posterJob'
const baseSprJobFlow = 'baseSprJob'
const outboundPreProcessorFlow = 'outboundPreProcessor'

const defaultFlow = scheduleFlow
const defaultChannel = ''
class App extends Component {
  constructor(props) {
    super(props);

    const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
      treeData: data,
      maxDepth: 5,
      flow:defaultFlow,
      channelName:defaultChannel,
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
    } = this.state;


    /*
    * Change path sequence to method call name
    */
    const alertNodeInfo = ({ node, path, treeIndex }) => {
      var stackTrace=""
      for (let i=path.length-1;i>=0;i--){
          stackTrace+=nodeAtIndex[path[i]]+"\n"
          //console.log(nodeAtIndex[path[i]])
      }
      //console.log(stackTrace)
      const objectString = Object.keys(node)
        .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
        .join(',\n   ');
      global.alert(
          stackTrace
      );
    };

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
      var {channelName, maxDepth} = this.state;

      if (channelName==null || maxDepth==null){
        return;
      }
      else{
        channelName=channelName.trimLeft()
      }

      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open("PUT", url, true);
      xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            
        }
      };
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xmlhttp.send(JSON.stringify({
        channelName,
        maxDepth,
        flow
      }));
    }

    const viewScheduleFlow = () => {
        this.setState({
          flow:scheduleFlow
        })
        generateTree
    }

    const viewBaseSprJobFlow = () => {
      this.setState({
        flow:baseSprJobFlow
      })
      generateTree
  }

  const viewOutboundPreProcessorFlow = () => {
    this.setState({
      flow:outboundPreProcessorFlow
    })
    generateTree
  }

    const viewPosterJobFlow = () => {
      this.setState({
        flow:posterJobFlow
      })
      generateTree
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
          <button onClick={generateTree} type="button"><b>GenerateTree</b></button>
      
        <button onClick={viewScheduleFlow} type="button" ><b>View Schedule Flow</b></button>
        <button onClick={viewOutboundPreProcessorFlow} type="button" ><b>View OutboundPreProcessor Flow</b></button>
        <button onClick={viewPosterJobFlow} type="button" ><b>View PosterJob Flow</b></button>
        <button onClick={viewBaseSprJobFlow} type="button" ><b>View BaseSprJob Flow</b></button>
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
