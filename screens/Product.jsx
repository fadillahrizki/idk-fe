import { ScrollView, View } from "react-native";
import { ListItem, Dialog, Input, Button, Text, Switch, Icon } from '@rneui/themed'
import { FAB } from "@rneui/base";
import axios from "axios";
import { useEffect, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";


export default ({navigation}) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL
    const [data, setData] = useState([])
    const [uoms, setUoms] = useState([])
    const [isDialog, setIsDialog] = useState(false)
    
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [color, setColor] = useState('')
    const [isRawMaterial, setIsRawMaterial] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [prices, setPrices] = useState([])
    
    const [selectedData, setSelectedData] = useState(null)
    const [selectedUom, setSelectedUom] = useState(null)

    useEffect(()=> {
        getData()
        getUom()
    }, [])

    
    const getUom = async () => {
        try{
            let response = await axios.get(API_URL+'/uoms/')
            setUoms(response.data.data)
        }catch(e){
            console.log(e)
        }
      }

    const getData = async () => {
        try{
            let response = await axios.get(API_URL+'/products/')
            setData(response.data.data)
        }catch(e){
            console.log(e)
        }
      }

    const storeData = async () => {
        try{
            let response = await axios.post(API_URL+'/products/', {
                uom_id: selectedUom.id,
                name: name,
                code: code,
                color: color,
                prices: prices,
                is_raw_material: isRawMaterial,
                is_active: isActive,
            })
            resetInput()
            getData()

        }catch(e){
            console.log(e)
        }
      }

    const deleteData = async (id) => {
        try{
            let response = await axios.delete(API_URL+'/products/'+id)
            getData()

        }catch(e){
            console.log(e)
        }
    }

    const editData = async (id) => {
        try{
            let response = await axios.put(API_URL+'/products/'+id, {
                uom_id: selectedUom.id,
                name: name,
                code: code,
                color: color,
                prices: prices,
                is_raw_material: isRawMaterial,
                is_active: isActive,
            })

            console.log(response.data)
            
            resetInput()
            getData()

        }catch(e){
            console.log(e)
        }
      }

      const openEditData = async (data) => {
          setSelectedData(data)
          setSelectedUom(uoms[uoms.findIndex(uom=>uom.id == data.uom_id)])
          setName(data.name)
          setCode(data.code)
          setColor(data.color)
          setPrices(data.prices.map(price=>price = price.price))
          setIsRawMaterial(data.is_raw_material == 1 ? true : false)
          setIsActive(data.is_active == 1 ? true : false)
          setIsDialog(true)
      }

      const resetInput = () => {
        setName('')
        setCode('')
        setColor('')
        setSelectedData(null)
        setSelectedUom(null)
        setPrices([])
        setIsRawMaterial(false)
        setIsActive(false)
        setIsDialog(false)
      }

      const deletePrice = (idx) => {
        setPrices(prices.filter((price, i)=> i != idx))
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
                    {
                        dt.is_active == 1 ? <Icon name="check-circle" type="material-community" color="green" /> : <Icon name="close-circle" type="material-community" color="red" />
                    }
                    <ListItem.Content>
                        <ListItem.Title>{dt.name}</ListItem.Title>
                        <ListItem.Subtitle>Code: {dt.code}</ListItem.Subtitle>
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

                    <Dialog.Title title={(selectedData!=null ? "Edit " :"Create " )+"Product"}/>
                    
                    <Text>Select Uom</Text>

                    <SelectDropdown
                        defaultButtonText="Select Uom"
                        buttonTextAfterSelection={(item, index) => {
                            return item.name
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.name
                        }}
                        data={uoms}
                        onSelect={(selectedItem, index) => {
                            setSelectedUom(selectedItem)
                        }}
                        buttonStyle={{marginVertical:12}}
                        defaultValue={selectedUom}
                    />

                    <Text>Name</Text>

                    <Input
                        placeholder='Name'
                        defaultValue={name}
                        onChangeText={(value) => setName(value)}
                    />

                    <Text>Code</Text>
                    
                    <Input
                        placeholder='Code'
                        defaultValue={code}
                        onChangeText={(value) => setCode(value)}
                    />

                    <Text>Color</Text>
                    
                    <Input
                        placeholder='Color'
                        defaultValue={color}
                        onChangeText={(value) => setColor(value)}
                    />

                    <Text>Is Raw Material</Text>
                    
                    <Switch
                        style={{marginVertical:12}}
                        value={isRawMaterial}
                        onValueChange={(value) => setIsRawMaterial(value)}
                    />

                    <Text>Is Active</Text>
                    
                    <Switch
                        style={{marginVertical:12}}
                        value={isActive}
                        onValueChange={(value) => setIsActive(value)}
                    />

                    <Text>Prices</Text>

                    {
                        prices.map((price, idx)=>(
                            <Input
                                enterKeyHint="done"
                                keyboardType="numeric"
                                key={idx}
                                rightIcon={
                                    <Icon name="delete" onPress={() => deletePrice(idx)} />
                                }
                                placeholder='Price'
                                defaultValue={price.toString()}
                                onChangeText={(value)=>setPrices(prices.map((prc, i)=>{
                                    if(i == idx) {
                                        return prc = value
                                    } else {
                                        return prc
                                    }
                                }))}
                            />
                        ))
                    }

                    <Button
                        style={{marginVertical:12}}
                        title={"Add Price"}
                        onPress={() => {
                            setPrices([...prices, ''])
                        }}
                    />

                    <Dialog.Actions>
                        <Dialog.Button
                        disabled={!selectedUom || !name || !code}
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