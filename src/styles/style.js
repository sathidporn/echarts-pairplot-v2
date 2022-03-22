import { makeStyles } from '@mui/styles';

const FONT_SIZE_HEAD = "1rem"
const FONT_SIZE_CONTENT = "0.7rem"
const FONT_SIZE_BUTTON = "0.8rem"
const FONT_SIZE_ICON = "1.5rem"

export const style = makeStyles((theme) => ({
    backdrop: {
        zIndex: 9999,
        color: '#ffffff',
    },
    flexEnd: {
        '&.container': {
            justifyContent: 'flex-end '
        }
    },
    background: {
        backgroundColor: '#242f39',
        '&.MuiPaper-root':{
            backgroundColor: '#242f39',
        },
    },
    circularProgress: {
        '&.MuiCircularProgress-root': {
            color: '#ffffff'
        }
    },
    blackIcon: {
        '&.MuiSvgIcon-root': {
            color: '#000a14',
            fontSize: 'medium'
        }
    },
    whiteIcon: {
        '&.MuiSvgIcon-root': {
            color: '#ffffff',
            fontSize: 'medium'
        }
    },
    blackBackground: {
        backgroundColor: '#000a14',
    },
    toolbox: {
        backgroundColor: '#242f39',
        overflowY: 'auto', 
        height: '100vh',
        color: '#ffffff'
    },
    sensorBox: {
        backgroundColor: '#242f39',
        borderRadius: 10,
        overflowY: 'auto',
        minHeight: '3vh',
        maxHeight: '20vh',
    },
    stepper: {
        '&.MuiStepIcon-root':{
            fontSize: "1.5rem",
            color: 'white',
            '&.MuiSvgIcon-root': {
                color: '#454c54'
            },
        },
        '&.MuiStepIcon-text':{
            fontSize: "0.8rem",
            color: 'white',
        },
        '&.Mui-active': {
           '&.MuiSvgIcon-root': {
            color: '#51b4ec'
           },
           '&.MuiStepIcon-root': {
            color: '#51b4ec'
           }
        },
        '&.Mui-completed': {
            color: '#454c54'
        },
    },
    stepContent: {
        backgroundColor: '#454c54',
        borderRadius: 20,
        padding:10,
        minHeight: '5vh'
    },
    activeIcon: {
        '&.Mui-active': {
            '&.MuiSvgIcon-root': {
                color: '#51b4ec'
            },
            '&.MuiStepIcon-root': {
            color: '#51b4ec'
            }
        } 
    },
    completedIcon: {
        '&.Mui-completed': {
            '&.MuiSvgIcon-root': {
                color: '#51b4ec'
            },
            '&.MuiStepIcon-root': {
            color: '#51b4ec'
            }
        }   
    },
    accordion: {
        '&.MuiAccordion-root': {
            backgroundColor: '#454c54',
            color: '#ffffff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            '&.MuiPaper-root': {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
            }
        },
        '&.MuiAccordion-rounded': {
            borderRadius: 20
        },
    },
    accordionSummary: {
        '&.MuiAccordionSummary-root': {
            backgroundColor: '#454c54',
            color: '#ffffff',
            borderRadius: 20
        }
    },
    accordionSummaryExpanded: {
        '&.MuiAccordionSummary-root': {
            backgroundColor: '#454c54',
            color: '#51b4ec',
        }
    },
    accordionDetail: {
        '&.MuiAccordionDetails-root': {
            backgroundColor: '#454c54',
            color: '#ffffff',
            borderRadius: 20,
        },
    },
    accordionIcon: {
        color: '#51b4ec',
        fontSize: FONT_SIZE_ICON
    },
    accordionIconExpanded: {
        color: '#51b4ec',
        fontSize: FONT_SIZE_ICON
    },
    dialog: {
        backgroundColor: "#242f39",
        color: "#ffffff"
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
    defaultButton: {
        '&.MuiButton-root': {
            borderRadius: 10,
            backgroundColor: '#51b4ec',
            fontSize: FONT_SIZE_BUTTON,
            color: '#000a14',
            height: 25,
            minWidth: '6vw',
            '&:hover': {
                backgroundColor: '#51b4ec',
                color: '#ffffff',
            },
        }
    },
    confirmButton: {
        '&.MuiButton-root': {
            borderRadius: 10,
            backgroundColor: '#35a040',
            fontSize: FONT_SIZE_BUTTON,
            color: '#ffffff',
            height: 25,
            minWidth: '6vw',
            '&:hover': {
                backgroundColor: '#35a040',
                color: '#ffffff',
            },
        }
    },
    continueButton: {
        '&.MuiButton-root': {
            borderRadius: 10,
            backgroundColor: '#004f96',
            fontSize: FONT_SIZE_BUTTON,
            color: '#ffffff',
            height: 30,
            minWidth: '6vw',
            '&:hover': {
                backgroundColor: '#004f96',
                color: '#ffffff',
            },
        }
    },
    backButton: {
        '&.MuiButton-root': {
            borderRadius: 10,
            backgroundColor: '#454c54',
            fontSize: FONT_SIZE_BUTTON,
            color: '#ffffff',
            height: 30,
            minWidth: '6vw',
            '&:hover': {
                backgroundColor: '#454c54',
                color: '#ffffff',
            },
        }
    },
    tableContainer: {
       '&.MuiTableContainer-root': {
            // overflowY: 'auto', 
            overflowX: 'auto', 
            maxHeight: '50vh',
            minWidth: '20vw',
            backgroundColor: '#242f39',
            borderRadius: 10,
       }
    },
    tableHead: {
        '&.MuiTableHead-root': {
            fontSize: FONT_SIZE_HEAD,
            backgroundColor: '#242f39',
            color: '#ffffff',
            position: "sticky",
            top: 0,
            borderBottomColor: 'black'
        }
    },
    tableBody: {
        '&.MuiTableBody-root': {
            fontSize: FONT_SIZE_CONTENT,
        }
    },
    tableCell: {
        '&.MuiTableCell-root': {
            borderBottomColor: '#242f39',
            backgroundColor: '#242f39',
            color: '#ffffff',
            fontSize: FONT_SIZE_CONTENT,
        },
        '&.MuiFormControlLabel-root': {
            color: '#ffffff',
            fontSize: FONT_SIZE_CONTENT,
        },
        '&.MuiFormControlLabel-label': {
            color: '#ffffff',
            fontSize: FONT_SIZE_CONTENT,
        }
    },
    formControlLabel: {
        '&.MuiFormControlLabel-root': {
            color: '#ffffff',
            fontSize: FONT_SIZE_CONTENT,
        },
        '&.MuiFormControlLabel-label': {
            color: '#ffffff',
            fontSize: FONT_SIZE_CONTENT,
        },
        '&.MuiTypography-root': {
            color: '#ffffff',
            fontSize: FONT_SIZE_CONTENT,
        }
    },
    blueText: {
        '&.MuiTypography-root': {
            color: '#51b4ec',
            fontSize: FONT_SIZE_CONTENT,
        }
    },
    headerTextWhite: {
        '&.MuiTypography-root': {
            color: '#ffffff',
            fontSize: FONT_SIZE_HEAD,
        }
    },
    headerTextBlue: {
        '&.MuiTypography-root': {
            color: '#51b4ec',
            fontSize: FONT_SIZE_HEAD,
        }
    },
    contentTextWhite: {
        '&.MuiTypography-root': {
            color: '#ffffff',
            fontSize: FONT_SIZE_CONTENT,
        }
    },
    contentTextBlack: {
        '&.MuiTypography-root': {
            color: '#000a14',
            fontSize: FONT_SIZE_CONTENT,
        }
    },
    textField: {
        color: "#ffffff",
        height: 30,
        borderColor: '#51b4ec',
        '&.MuiFormControl-root ': {
            // minWidth: "-webkit-fill-available",
            borderColor: '#51b4ec',
        },
        '&.MuiOutlinedInput-root': {
            color: "#ffffff",
            backgroundColor: '#242f39',
            fontSize: FONT_SIZE_CONTENT,
            paddingLeft: 20,
            minWidth: '6vw',
            borderColor: '#51b4ec',
            borderRadius: 10,
            '& fieldset': {
                borderColor: '#51b4ec',
                color: '#ffffff',
            },
            '&:hover fieldset': {
                borderColor: '#ffffff',
                color: '#ffffff',
            },
            '&:disabled': {
                backgroundColor: '#454c54',
                color: '#ffffff',
            },
            '&.Mui-disabled': {
                borderColor: '#51b4ec',
                color: '#ffffff',
            }
        },
        '&.Mui-focused fieldset': {
            borderColor: '#51b4ec',
            color: '#ffffff',
        },
        '&.Mui-disabled fieldset': {
            borderColor: '#51b4ec',
            color: '#ffffff',
        }
    },
    selector: {
        // '&.MuiSelect-select': {
        //     borderColor: '#51b4ec',
        // },
        // '&.MuiInput-root': {
        //     borderColor: '#51b4ec',
        // },
        // '&.MuiSelect-outlined': {
        //     borderColor: '#51b4ec',
        // },
        // '&.MuiOutlinedInput-input' : {
        //     borderColor: '#51b4ec',
        // },
        // '&.MuiInputBase-input': {
        //     borderColor: '#51b4ec',
        // },
        '&.MuiOutlinedInput-root': {
            display: "flex",
            // flexWrap: "wrap",
            height: 30,
            color: "#ffffff",
            backgroundColor: '#242f39',
            fontSize: FONT_SIZE_CONTENT,
            paddingLeft: 20,
            minWidth: '6vw',
            borderColor: '#51b4ec',
            borderRadius: 10,
            '&:before': {
                borderColor: '#51b4ec',
            },
            '&:after': {
                borderColor: '#51b4ec',
            }
        },
        '&.MuiInputBase-root': {
            borderColor: '#51b4ec',
        },
        '&.MuiSvgIcon-root': {
            fill: "#ffffff",
            fontSize: FONT_SIZE_ICON,
            paddingRight: 5
        },
    },
    selectorIcon: {
        fill: "#ffffff",
        fontSize: FONT_SIZE_ICON,
        paddingRight: 5
    },
    menuItem: {
        '&.MuiMenuItem-root': {
            backgroundColor: '#242f39',
            color: '#ffffff',
            paddingRight: 10,
            '&:hover': {
                backgroundColor: '#454c54',
                color: '#ffffff',
            }, 
            '&.Mui-selected': {
                backgroundColor: '#51b4ec',
                color: '#ffffff',
                '&:hover': {
                    backgroundColor: '#454c54',
                    color: '#ffffff',
                },
            },  
        },
        "&.MuiList-padding ":{
            paddingTop:0,
            paddingBottom:0,
            borderRadius:5
        },
    },
    datePicker: {
        '& .MuiInputBase-input': {
            color: 'white',
            fontSize: FONT_SIZE_CONTENT,
            padding:"6px 10px",
        },
        '&.MuiFormControl-root ': {
            minWidth: "-webkit-fill-available",
            borderColor: '#51b4ec',
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
        '&.MuiInputLabel-root ': {
            color: '#51b4ec',
        },
        "& label.Mui-focused": {
            color: '#51b4ec',
        },   
    },





}
))