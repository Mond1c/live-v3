import React from "react";
import "../App.css";
import { PresetsTable } from "./PresetsTable";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { errorHandlerWithSnackbar } from "../errors";

class TickerTable extends PresetsTable {
    rowsFilter(row) {
        return super.rowsFilter(row) && row.settings.part === this.props.partType;
    }
}

TickerTable.defaultProps = {
    ...PresetsTable.defaultProps,
    apiPath: "/tickermessage",
    apiTableKeys: ["type", "text", "periodMs"],
};

TickerTable.propTypes = {
    partType: PropTypes.string.isRequired,
};

function TickerMessage() {
    const { enqueueSnackbar,  } = useSnackbar();
    return (
        <div className="TickerPanel">
            <Typography variant="h5" gutterBottom>Short</Typography>
            <TickerTable partType={"short"} createErrorHandler={errorHandlerWithSnackbar(enqueueSnackbar)}/>
            <Typography variant="h5" gutterBottom>Long</Typography>
            <TickerTable partType={"long"} createErrorHandler={errorHandlerWithSnackbar(enqueueSnackbar)}/>
        </div>
    );
}

export default TickerMessage;

