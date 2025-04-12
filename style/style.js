import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
formContext: {
  width: "100%",
  height: "100%",
  bottom: 0,
  backgroundColor: "#ffffff",
  alignItems: "center",
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30
  
},
form:{
  width: "100%",
  height: "auto",
  marginTop: 80,
  padding: 10,
  backgroundColor: "#ffffff",

},

formLabel: {
  color: "#000000",
  fontSize: 18,
paddingLeft: 20,
},

formInput: {
  width: "90%",
  height: 40,
  fontSize: 20,
  backgroundColor: "#C0C0C0",
  borderRadius: 50,
  marginTop: 10,
  marginBottom: 10,
  paddingLeft: 20,
  marginLeft: "5%"
},
buttonCalculator: {
  borderRadius: 50,
  alignItems: "center",
  justifyContent: "center",
  width: "90%",
  height: 45,
  backgroundColor: "#FF0043",
  paddingTop: 14,
  paddingBottom: 14,
  marginLeft: "5%",
  marginTop: 30
},

textButtonCalculator: {
  fontSize:15,
  color: "#ffffff"
},

errorMessage: {
  fontSize: 12,
  color: "red",
  fontWeight: "bold",
  marginTop: 5,
  marginLeft: "25%",
  paddingLeft: 20,
},

textTitle: {
  marginLeft: "35%",
alignItems: "center",
  fontSize: 30,
  color: "black",
  fontWeight: "bold",
  marginTop: 50,
  marginTop: "30%",
  paddingLeft: 20,
},

formButton: {
  borderRadius: 50,
  alignItems: "center",
  justifyContent: "center",
  width: "90%",
  height: 45,
  backgroundColor: "black",
  paddingTop: 14,
  paddingBottom: 14,
  marginLeft: "5%",
  marginTop: 30,
  color: "white"
},

textButton: {
  fontSize:15,
  color: "white"
},

});



export default styles