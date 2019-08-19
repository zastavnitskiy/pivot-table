import React from "react";
import { ManagerProps } from "../Manager/Manager";
import styles from "./Header.module.css";
type HeaderProps = Pick<ManagerProps, "tableName">;

export const Header: React.FC<HeaderProps> = props => (
  <div className={styles.container}>
    <h1 className={styles.header}>{props.tableName}</h1>
    {/* Table configuration can be added here */}
  </div>
);
