import React from "react";
import { useReducer, useEffect } from "react";
import db from "./utils/firebase";
import { Link, Route } from "wouter";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

import "tachyons";
import "./App.scss";
import styles from "./App.module.scss";

export interface IData {
  id: string;
  name: string;
  orders: number;
}

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
    <div className="w100">
      <div className="w100">
        <header className="ph3 ph5-ns w-100 bg-transparent pv3 mb4 mb5-ns bb b--black-10 overflow-auto">
          <div className="nowrap mw9 center">
            {["bar", "pie", "circle", "tree"].map(i => (
              <Link href={`/${i}`} key={i}>
                <a className="pv1-ns f6 fw6 dim link black-70 mr2 mr3-m mr4-l dib">
                  {i}
                </a>
              </Link>
            ))}
          </div>
        </header>
      </div>
      <div className={styles.app}>
        <Route path="/pie">
          <PieChart data={data} />
        </Route>
        <Route path="/bar">
          <BarChart data={data} />
        </Route>
        <pre className={styles.pre}>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default App;
