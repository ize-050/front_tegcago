"use client";

import Table from "@/components/Base/Table";
import { Fragment } from "react";
export default function TableComponent({ user }: { user: any }) {
  return (
    <Fragment>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
          </Table.Tr>
        </Table.Thead>
      </Table>
    </Fragment>
  );
}
