import { ActivityIndicator, Dimensions, Modal, StyleSheet, View } from "react-native";
export default function Loader({visible}){
    return(
        <Modal visible={visible} transparent>
            <View style={styles.modelView}>
                <View style={styles.mainView}>
                <ActivityIndicator size={"large"}/>
                </View>
            </View>
        </Modal>
    )
}

const styles=StyleSheet.create({
    modelView:{
        width:Dimensions.get("window").width,
        height:Dimensions.get("window").height,
        backgroundColor:"rgba(0,0,0,0.5)",
        justifyContent:"center",
        alignItems:"center"
    },
    mainView:{
        width:100,
        height:100,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:50
    }
})