import { makeStyles } from "@material-ui/core/styles";

const FONT_SIZE_HEAD = "1rem"
const FONT_SIZE_CONTENT = "0.7rem"
const FONT_SIZE_BUTTON = "0.8rem"
const FONT_SIZE_ICON = "1.5rem"

export const style = makeStyles((theme) => ({
    background: {
        backgroundColor: '#242f39',
    },
    accordion: {
        backgroundColor: '#242f39',
    },
    toolbox: {
        backgroundColor: '#242f39',
        overflowY: 'auto', 
        height: '100vh'
    },
    sensorBox: {
        backgroundColor: '#242f39',
        borderRadius: 10
    },
    accordionSummary: {
        backgroundColor: '#454c54',
        color: '#ffffff'
    },
    accordionSummaryExpanded: {
        backgroundColor: '#454c54',
        color: '#51b4ec',
    },
    accordionDetail: {
        backgroundColor: '#454c54',
        color: '#ffffff'
    },
    accordionIcon: {
        color: '#ffffff',
        fontSize: FONT_SIZE_ICON
    },
    accordionIconExpanded: {
        color: '#51b4ec',
        fontSize: FONT_SIZE_ICON
    },
    input: {
        backgroundColor: '#51b4ec',
        color: '#ffffff',
        borderRadius: 10,
    },
    inputFile: {
        width: "0.1px",
        height: "0.1px",
        opacity: 0,
        overflow: 'hidden',
        position: 'absolute',
        zIndex: -1,
    },
    button: {
        backgroundColor: '#51b4ec',
        fontSize: FONT_SIZE_BUTTON,
        color: '#ffffff',
        height: 20,
        '&:hover': {
            backgroundColor: '#51b4ec',
            color: '#ffffff',
        },
    },
    tableContainer: {
        overflowY: 'auto', 
        overflowX: 'auto', 
        height: '50vh',
        width: '22vw',
        backgroundColor: '#242f39',
        borderRadius: 5,
    },
    tableHead: {
        fontSize: FONT_SIZE_HEAD,
        backgroundColor: '#242f39',
        color: '#ffffff',
        position: "sticky",
        top: 0,
        borderBottomColor: 'black'
    },
    tableBody: {
        fontSize: FONT_SIZE_CONTENT,
    },
    tableCell: {
        borderBottomColor: '#242f39'
    },
    formControlLabel: {
        color: '#ffffff',
        fontSize: FONT_SIZE_CONTENT,
    },
    blueText: {
        color: '#51b4ec',
        fontSize: FONT_SIZE_CONTENT,
    },
    headerText: {
        color: '#51b4ec',
        fontSize: FONT_SIZE_HEAD,
    },
    contentTextWhite: {
        color: '#ffffff',
        fontSize: FONT_SIZE_CONTENT,
    },
    textField: {
        color: "#ffffff",
        height: 20,
        fontSize: FONT_SIZE_CONTENT,
        '&.MuiTextField-root': {
            color: 'white',
            fontSize: FONT_SIZE_CONTENT,
            borderColor: '#51b4ec',
            '& fieldset': {
                borderColor: '#51b4ec',
            },
            '&:hover fieldset': {
                borderColor: '#51b4ec',
            },
            "&.Mui-focused fieldset": {
                borderColor: '#51b4ec',
            },
            "&.Mui-disabled fieldset": {
                borderColor: '#51b4ec',
            }
        },
        "& input.Mui-disabled": {
            color: 'white',
            borderColor: '#51b4ec',
        },
        "& label.Mui-disabled": {
            color: '#51b4ec',
        },
        // input label when focused
        "& label.Mui-focused": {
            color: '#51b4ec',
        },

    },
    selector: {
        display: "flex",
        flexWrap: "wrap",
        color: "#ffffff",
        backgroundColor: '#242f39',
        fontSize: FONT_SIZE_CONTENT,
        paddingLeft: 20,
        borderRadius: 10,
        minWidth: '6vw',
        '&.MuiPaper-root': {
            backgroundColor: '#242f39'
        },
        '&.MuiList-root': {
            backgroundColor: '#242f39'
        },
        '&.MuiMenu-list' : {
            backgroundColor: '#242f39'
        },
    },
    selectorIcon: {
        fill: "#ffffff",
        fontSize: FONT_SIZE_ICON,
        paddingRight: 5
    },
    menuItem: {
        backgroundColor: '#242f39',
        color: '#ffffff',
        paddingRight: 10,
        "&.MuiList-padding ":{
            paddingTop:0,
            paddingBottom:0,
            borderRadius:5
        }
    },
    datePicker: {
        backgroundColor: 'linear-gradient(125.86deg, rgba(255, 255, 255, 0.3) -267.85%, rgba(255, 255, 255, 0) 138.29%)',
        color: '#51b4ec',
        borderColor: "white",
        '& .MuiInputBase-input': {
            color: 'white',
            fontSize: FONT_SIZE_CONTENT,
            padding:"6px 10px"
        },
        '&.MuiFormControl-root ': {
            minWidth: "-webkit-fill-available"
        },
        '&.MuiTextField-root': {
            color: 'white',
            fontSize: FONT_SIZE_CONTENT,
            borderColor: '#51b4ec',
            '& fieldset': {
                borderColor: '#51b4ec',
            },
            '&:hover fieldset': {
                borderColor: '#51b4ec',
            },
            "&.Mui-focused fieldset": {
                borderColor: '#51b4ec',
            },
            "&.Mui-disabled fieldset": {
                borderColor: '#51b4ec',
            }
        },
        "& input.Mui-disabled": {
            color: 'white',
            borderColor: '#51b4ec',
        },
        "& label.Mui-disabled": {
            color: '#51b4ec',
        },
        // input label when focused
        "& label.Mui-focused": {
            color: '#51b4ec',
        },
        // // focused color for input with variant='standard'
        // "& .MuiInput-underline:before": {
        //     borderBottomColor: '#51b4ec',
        // },
        // // focused color for input with variant='standard'
        // "& .MuiInput-underline:after": {
        //     borderBottomColor: '#51b4ec',
        // },
        // // focused color for input with variant='filled'
        // "& .MuiFilledInput-underline:after": {
        //     borderBottomColor: '#51b4ec',
        // },

        
    },





}
))