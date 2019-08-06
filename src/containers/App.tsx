import React from "react";
import { useReducer, useEffect } from "react";
import db from "../utils/firebase";
import { Link, Route } from "wouter";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import Line from "../components/Line";
import Circle from "../components/Circle";
import Tree from "../components/Tree";
import useLoadPcd from "useloadpcd";

import "tachyons";
import "./App.scss";
import styles from "./App.module.scss";
import { IData } from "../type/data";
import { MockDataLine, MockDataCircle, MockDataTree } from "../data/mock";

const App: React.FC = () => {
  const dashCollections = db.collection("dashes");

  const [pcdRef, status] = useLoadPcd("/demo.pcd", {
    backgroundColor: "#0a0a0a",
    particalSize: 0.01,
    camera: {
      aspect: 1,
      far: 200,
      fov: 10,
      near: 1,
      position: {
        x: 0.4,
        z: 4
      }
    },
    controls: {
      dynamicDampingFactor: 10.03,
      maxDistance: 30,
      minDistance: 1,
      noPan: false,
      noRotate: false,
      noZoom: false,
      panSpeed: 0.25,
      rotateSpeed: 2.0,
      staticMoving: true,
      zoomSpeed: 3
    },
    windowSize: {
      height: 800,
      width: 800
    }
  });

  const [data, dispatch] = useReducer(
    (state, action) => {
      let newData = [...state];

      switch (action.type) {
        case "added":
          // console.log("added");
          newData = [...newData, action.doc];
          break;

        case "modified":
          // console.log("modified");
          const index = newData.findIndex(i => i.id === action.doc.id);
          newData[index] = action.doc;
          break;

        case "removed":
          // console.log("removed");
          newData = newData.filter(i => i.id !== action.doc.id);
          break;

        default:
          break;
      }

      return newData;
    },
    [] as IData[]
  );

  const onUpdate = (snapshot: any) => {
    console.log("on update, with old dc:", data);

    snapshot.docChanges().forEach((change: any) => {
      const doc = {
        id: change.doc.id,
        name: change.doc.data().name,
        orders: change.doc.data().orders
      } as IData;

      dispatch({ type: change.type, doc });
    });
  };

  useEffect(() => {
    console.log("start listening");
    dashCollections.onSnapshot(onUpdate);
  }, []);

  return (
    <div className={styles.app}>
      <div className="w100">
        <div className="w100">
          <header className="ph3 ph5-ns w-100 bg-transparent pv3 mb4 mb5-ns bb b--black-10 overflow-auto">
            <div className="nowrap mw9 center">
              {["bar", "pie", "line", "circle", "tree", "pcd"].map(i => (
                <Link href={`/${i}`} key={i}>
                  <a className="pv1-ns f6 fw6 dim link black-70 mr2 mr3-m mr4-l dib">
                    {i}
                  </a>
                </Link>
              ))}
            </div>
          </header>
        </div>
        <div className="w100 tc pv3">
          <Route path="/pie">
            <PieChart data={data} />
          </Route>
          <Route path="/bar">
            <BarChart data={data} />
          </Route>
          <Route path="/line">
            <Line data={MockDataLine} />
          </Route>
          <Route path="/circle">
            <Circle data={MockDataCircle} />
          </Route>
          <Route path="/tree">
            <Tree data={MockDataTree} />
          </Route>
          <Route path="/pcd">
            <div ref={pcdRef} style={{ width: 800, height: 800 }} />
          </Route>
        </div>
      </div>
      <div className="w100">
        <pre className={styles.pre}>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default App;
