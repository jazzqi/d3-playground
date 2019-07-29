import React from "react";
import { useReducer, useEffect } from "react";
import db from "../utils/firebase";
import { Link, Route } from "wouter";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import Line from "../components/Line";

import "tachyons";
import "./App.scss";
import styles from "./App.module.scss";

export interface IData {
  id: string;
  name: string;
  orders: number;
}

export interface IData2 {
  id: string;
  date: string;
  count: number;
}

const MockData2 = [
  {
    id: "1",
    date: "2018-11-12",
    count: 234
  },
  {
    id: "2",
    date: "2018-11-19",
    count: 34
  },
  {
    id: "3",
    date: "2018-11-09Z06:03:32",
    count: 134
  },
  {
    id: "4",
    date: "2018-11-23Z06:03:32",
    count: 178
  }
] as IData2[];

const App: React.FC = () => {
  const dashCollections = db.collection("dashes");

  const [data, dispatch] = useReducer(
    (state, action) => {
      let newData = [...state];

      switch (action.type) {
        case "added":
          console.log("added");
          newData = [...newData, action.doc];
          break;

        case "modified":
          console.log("modified");
          const index = newData.findIndex(i => i.id === action.doc.id);
          newData[index] = action.doc;
          break;

        case "removed":
          console.log("removed");
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
      console.log(change);
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
              {["bar", "pie", "line", "circle", "tree"].map(i => (
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
            <Line data={MockData2} />
          </Route>
          <Route path="/circle">circle</Route>
          <Route path="/tree">tree</Route>
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