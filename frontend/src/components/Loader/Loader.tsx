import {CircularProgress, Grid} from "@mui/material";

function Loader() {
    return <Grid container width='100%' height='100vh'>
        <CircularProgress style={{alignSelf: "center", margin: '0 auto'}}/>
    </Grid>
}

export default Loader