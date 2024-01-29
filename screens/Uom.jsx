import { ScrollView, View } from "react-native";
import { ListItem, Dialog, Input, Button, Text } from '@rneui/themed'
import { FAB } from "@rneui/base";
import axios from "axios";
import { useEffect, useState } from "react";

export default ({navigation}) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL
    const [data, setData] = useState([])
    const [isDialog, setIsDialog] = useState(false)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const [selectedData, setSelectedData] = useState(null)

    useEffect(()=> {
        getData()
    }, [])

    const getData = async () => {
        try{
            let response = await axios.get(API_URL+'/uoms/')
            setData(response.data.data)
        }catch(e){
            console.log(e)
        }
      }

    const storeData = async () => {
        try{
            let response = await axios.post(API_URL+'/uoms/', {
                name: name,
                description: description,
            })
            resetInput()
            getData()
        }catch(e){
            console.log(e)
        }
      }

    const deleteData = async (id) => {
        try{
            let response = await axios.delete(API_URL+'/uoms/'+id)
            getData()

        }catch(e){
            console.log(e)
        }
    }

    const editData = async (id) => {
        try{
            let response = await axios.put(API_URL+'/uoms/'+id, {
                name: name,
                description: description,
            })
            resetInput()
            getData()

        }catch(e){
            console.log(e)
        }

        
      }

      const openEditData = async (data) => {
        setSelectedData(data)
        setName(data.name)
        setDescription(data.description)
        setIsDialog(true)
      }

      const resetInput = () => {
        setName('')
        setDescription('')
        setSelectedData(null)
        setIsDialog(false)
      }
    
  return (
    <View style={{
        flex:1
    }}>
        <ScrollView>
            {
                data.map((dt, i) => (
                <ListItem.Swipeable
                    onPress={() => openEditData(dt)}
                    key={i} 
                    bottomDivider
                    rightContent={(reset) => (
                        <Button
                            title="Delete"
                            onPress={() => {
                                deleteData(dt.id)
                                reset()
                            }}
                            icon={{ name: 'delete', color: 'white' }}
                            buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                        />
                    )}
                    >
                    <ListItem.Content>
                        <ListItem.Title>{dt.name}</ListItem.Title>
                        <ListItem.Subtitle>{dt.description}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
                ))
            }
        </ScrollView>

        <FAB
            visible={true}
            placement="right"
            icon={{ name: 'add', color: 'white' }}
            color="black"
            onPress={()=> setIsDialog(true)}
        />

        <Dialog
            isVisible={isDialog}
            onBackdropPress={() => setIsDialog(false)}
            overlayStyle={{maxHeight:'80%'}}
            >
                <ScrollView>

                    <Dialog.Title title={(selectedData!=null ? "Edit " :"Create " )+"Uom"}/>

                    <Text>Name</Text>

                    <Input
                        placeholder='Name'
                        defaultValue={name}
                        onChangeText={(value) => setName(value)}
                    />

                    <Text>Description</Text>
                    
                    <Input
                        multiline
                        numberOfLines={4}
                        placeholder='Description'
                        defaultValue={description}
                        onChangeText={(value) => setDescription(value)}
                    />

                    <Dialog.Actions>
                        <Dialog.Button
                        disabled={!name || !description}
                        title="Confirm"
                        onPress={() => {
                            if(selectedData!=null) {
                                editData(selectedData.id)
                            } else {
                                storeData()
                            }
                        }}
                        />
                        <Dialog.Button title="Cancel" titleStyle={{color:'red'}} onPress={() => resetInput()} />
                    </Dialog.Actions>
                </ScrollView>
            </Dialog>
    </View>
  );
};