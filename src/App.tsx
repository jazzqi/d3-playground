import React from "react";
import { useReducer, useEffect } from "react";
import db from "./utils/firebase";
import styles from "./App.module.scss";
import Graph from "./Graph";

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
    <div className={styles.app}>
      <Graph data={data} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default App;
