import { IData2, IData3, IData4 } from "../type/data";

export const MockDataLine = [
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

export const MockDataCircle = [
  { name: "news", parent: "" },
  { name: "tech", parent: "news" },
  { name: "sport", parent: "news" },
  { name: "music", parent: "news" },
  { name: "learn", parent: "news" },
  { name: "ai", parent: "tech", amount: 7 },
  { name: "coding", parent: "tech", amount: 5 },
  { name: "tablets", parent: "tech", amount: 4 },
  { name: "laptops", parent: "tech", amount: 6 },
  { name: "d3", parent: "tech", amount: 3 },
  { name: "gaming", parent: "tech", amount: 3 },
  { name: "football", parent: "sport", amount: 6 },
  { name: "hockey", parent: "sport", amount: 3 },
  { name: "baseball", parent: "sport", amount: 5 },
  { name: "tennis", parent: "sport", amount: 6 },
  { name: "f1", parent: "sport", amount: 1 },
  { name: "house", parent: "music", amount: 3 },
  { name: "rock", parent: "music", amount: 2 },
  { name: "punk", parent: "music", amount: 5 },
  { name: "jazz", parent: "music", amount: 2 },
  { name: "pop", parent: "music", amount: 3 },
  { name: "classical", parent: "music", amount: 5 },
  { name: "golang", parent: "learn", amount: 7 },
  { name: "MBA", parent: "learn", amount: 3 }
] as IData3[];

export const MockDataTree = [
  { name: "news", parent: "", department: "Management" },
  { name: "tech", parent: "news", department: "IT" },
  { name: "sport", parent: "news", department: "OK" },
  { name: "music", parent: "news", department: "Hardware" },
  { name: "bob", parent: "music", department: "Hardware" }
] as IData4[];
