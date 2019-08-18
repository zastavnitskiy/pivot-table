import React from "react";
import { TableProps } from "../Table/Table";
import styles from "./Header.module.css";

export const Header: React.FC<TableProps> = props => (
  <div className={styles.container}>
    <h1 className={styles.header}>{props.tableName}</h1>
    <div className={styles.inputs}>Density(to be implemnted)</div>
  </div>
);
