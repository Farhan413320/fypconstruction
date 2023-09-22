import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useState, useEffect } from "react";

const User=({item})=>{
    return(
        <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.username}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item?.email}</Text>
      </View>
    </Pressable>
    )
}
export default User;

const styles = StyleSheet.create({});