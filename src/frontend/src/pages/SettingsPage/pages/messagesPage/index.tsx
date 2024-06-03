import { ColDef, ColGroupDef, SelectionChangedEvent } from "ag-grid-community";
import { useState } from "react";
import TableComponent from "../../../../components/tableComponent";
import { Card, CardContent } from "../../../../components/ui/card";
import useAlertStore from "../../../../stores/alertStore";
import { useMessagesStore } from "../../../../stores/messagesStore";
import HeaderMessagesComponent from "./components/headerMessages";
import useMessagesTable from "./hooks/use-messages-table";
import useRemoveMessages from "./hooks/use-remove-messages";

export default function MessagesPage() {
  const setMessages = useMessagesStore((state) => state.setMessages);

  const [columns, setColumns] = useState<Array<ColDef | ColGroupDef>>([]);
  const [rows, setRows] = useState<any>([]);

  const setErrorData = useAlertStore((state) => state.setErrorData);
  const setSuccessData = useAlertStore((state) => state.setSuccessData);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const { handleRemoveMessages } = useRemoveMessages(
    setRows,
    setSelectedRows,
    setSuccessData,
    setErrorData,
    selectedRows,
  );

  useMessagesTable(setColumns, setRows, setMessages);

  return (
    <div className="flex h-full w-full flex-col justify-between gap-6">
      <HeaderMessagesComponent
        selectedRows={selectedRows}
        handleRemoveMessages={handleRemoveMessages}
      />

      <div className="flex h-full w-full flex-col justify-between pb-8">
        <Card x-chunk="dashboard-04-chunk-2" className="h-full pt-4">
          <CardContent className="h-full">
            <TableComponent
              overlayNoRowsTemplate="No data available"
              onSelectionChanged={(event: SelectionChangedEvent) => {
                setSelectedRows(
                  event.api.getSelectedRows().map((row) => row.index),
                );
              }}
              rowSelection="multiple"
              suppressRowClickSelection={true}
              pagination={true}
              columnDefs={columns}
              rowData={rows}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}