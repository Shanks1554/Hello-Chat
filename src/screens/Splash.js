import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Splash(){
    const navigation=useNavigation();
    useEffect(()=>{
        setTimeout(()=>{
            checkLogIn();
        },2000)
    },[])

    const checkLogIn=async()=>{
        const id= await AsyncStorage.getItem("USERID")
        if(id!==null){
            navigation.navigate("Main")
        }else{
            navigation.navigate("LogIn");
        }
    }
    return(
        <View style={styles.conatiner}>
        <Image
            source={require("../images/logo.png")}
            style={styles.logo}
        />
        </View>
    )
}

const styles=StyleSheet.create({
    conatiner:{
        flex:1,
        backgroundColor:"black",
        justifyContent:"center",
        alignItems:"center"
    },
    logo:{
        position:"absolute",
        alignItems:"center",
        justifyContent:"center",
        height:300,
        width:300
    }
})