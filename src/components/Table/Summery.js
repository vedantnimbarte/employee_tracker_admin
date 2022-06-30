import { useState } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  CircularProgress,
} from "@material-ui/core";
import moment from "moment";

export default function SummeryComponent({ users, isLoading, page_no }) {
  const [open, setOpen] = useState(false);
  const [reportId, setReportId] = useState();

  return (
    <>
      <Table className="mb-0">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Sr No</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Work Time</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>BreakTime</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Present</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Breaks</TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={10} style={{ textAlign: "center" }}>
              <CircularProgress size={26} />
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} style={{ textAlign: "center" }}>
              No Data Available
            </TableCell>
          </TableRow>
        ) : (
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1 + 10 * page_no}</TableCell>
                <TableCell className="pl-3 fw-normal">{user.name}</TableCell>
                <TableCell className="pl-3 fw-normal">
                  {moment
                    .duration(user.workTime, "seconds")
                    .format("hh:mm:ss", {
                      trim: false,
                    })}
                </TableCell>
                <TableCell className="pl-3 fw-normal">
                  {moment
                    .duration(user.breakTime, "seconds")
                    .format("hh:mm:ss", {
                      trim: false,
                    })}
                </TableCell>
                <TableCell>{user.presentCount.toString()}</TableCell>
                <TableCell>{user.breakCount.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </>
  );
}
