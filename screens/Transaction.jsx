import { ScrollView, View } from "react-native";
import { ListItem, Dialog, Input, Button, Text } from '@rneui/themed'
import { FAB } from "@rneui/base";
import axios from "axios";
import { useEffect, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from '@react-native-community/datetimepicker';

export default ({navigation}) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL

    const [data, setData] = useState([])
    const [isDialog, setIsDialog] = useState(false)
    const [isDateOpen, setIsDateOpen] = useState(false)
    
    const [transactionDate, setTransactionDate] = useState(new Date())
    const [customerName, setCustomerName] = useState('')
    const [notes, setNotes] = useState('')
    const [qty, setQty] = useState('')
    const [price, setPrice] = useState('')
    const [discount1, setDiscount1] = useState('')
    const [discount2, setDiscount2] = useState('')

    const [products, setProducts] = useState([])
    const [uoms, setUoms] = useState([])

    const [selectedData, setSelectedData] = useState(null)
    const [selectedUom, setSelectedUom] = useState(null)
    const [selectedProduct, setSelectedProduct]  = useState(null)

    useEffect(()=> {
        getProducts()
        getUom()
        getData()
    }, [])

    const getProducts = async () => {
        try{
            let response = await axios.get(API_URL+'/products/')
            setProducts(response.data.data)
        }catch(e){
            console.log(e)
        }
      }

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
            let response = await axios.get(API_URL+'/transactions/')
            setData(response.data.data)
        }catch(e){
            console.log(e)
        }
      }

    const storeData = async () => {
        try{
            let response = await axios.post(API_URL+'/transactions/', {
                transaction_date: transactionDate,
                customer_name: customerName,
                notes: notes,
                qty: qty,
                uom_id: selectedUom.id,
                product_id: selectedProduct.id,
                price: price,
                disc_1: discount1,
                disc_2: discount2,
            })
            resetInput()
            getData()

        }catch(e){
            console.log(e)
        }
      }

    const deleteData = async (id) => {
        try{
            let response = await axios.delete(API_URL+'/transactions/'+id)
            getData()

        }catch(e){
            console.log(e)
        }
    }

    const editData = async (id) => {
        try{
            let response = await axios.put(API_URL+'/transactions/'+id, {
                transaction_date: transactionDate,
                customer_name: customerName,
                notes: notes,
                qty: qty,
                uom_id: selectedUom.id,
                product_id: selectedProduct.id,
                price: price,
                disc_1: discount1,
                disc_2: discount2,
            })
            resetInput()
            getData()
        }catch(e){
            console.log(e)
        }

        
      }

      const openEditData = async (data) => {
        setSelectedData(data)
        setTransactionDate(new Date(data.transaction_date))
        setCustomerName(data.customer_name)
        setNotes(data.notes)
        setQty(data.details.qty?.toString())
        setPrice(data.details.price?.toString())
        setDiscount1(data.details.disc_1?.toString())
        setDiscount2(data.details.disc_2?.toString())
        setSelectedProduct(products[products.findIndex(product=>product.id == data.details.product_id)])
        setSelectedUom(uoms[uoms.findIndex(uom=>uom.id == data.details.uom_id)])
        setIsDialog(true)
      }

      const resetInput = () => {
        setTransactionDate(new Date())
        setCustomerName('')
        setNotes('')
        setQty('')
        setPrice('')
        setDiscount1('')
        setDiscount2('')
        setSelectedProduct(null)
        setSelectedUom(null)
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
                        <ListItem.Title>{dt.customer_name}</ListItem.Title>
                        <ListItem.Subtitle>{dt.transaction_date}</ListItem.Subtitle>
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
                    <Dialog.Title title={(selectedData!=null ? "Edit " :"Create " )+"Transaction"}/>

                    <Text>Customer Name</Text>

                    <Input
                        placeholder='Customer Name'
                        defaultValue={customerName}
                        onChangeText={(value) => setCustomerName(value)}
                    />

                    <Text>Transaction Date</Text>

                    <DateTimePicker mode="date"  onChange={(event, date)=>setTransactionDate(date)} value={transactionDate} />

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

                    <Text>Select Product</Text>

                    <SelectDropdown
                        defaultButtonText="Select Product"
                        buttonTextAfterSelection={(item, index) => {
                            return item.name
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.name
                        }}
                        data={products}
                        onSelect={(selectedItem, index) => {
                            setSelectedProduct(selectedItem)
                        }}
                        buttonStyle={{marginVertical:12}}
                        defaultValue={selectedProduct}
                    />

                    <Text>Qty</Text>
                    
                    <Input
                        enterKeyHint="done"
                        keyboardType="numeric"
                        placeholder='Qty'
                        defaultValue={qty}
                        onChangeText={(value) => setQty(value)}
                    />

                    <Text>Price</Text>
                    
                    <Input
                        enterKeyHint="done"
                        keyboardType="numeric"
                        placeholder='Price'
                        defaultValue={price}
                        onChangeText={(value) => setPrice(value)}
                    />
                    
                    <Text>Discount 1</Text>
                    
                    <Input
                        enterKeyHint="done"
                        keyboardType="numeric"
                        placeholder='Discount 1'
                        defaultValue={discount1}
                        onChangeText={(value) => setDiscount1(value)}
                    />

                    <Text>Discount 2</Text>
                    
                    <Input
                        enterKeyHint="done"
                        keyboardType="numeric"
                        placeholder='Discount 2'
                        defaultValue={discount2}
                        onChangeText={(value) => setDiscount2(value)}
                    />

                    <Text>Notes</Text>
                    
                    <Input
                        multiline
                        numberOfLines={4}
                        placeholder='Notes'
                        defaultValue={notes}
                        onChangeText={(value) => setNotes(value)}
                    />

                    <Dialog.Actions>
                        <Dialog.Button
                        disabled={!price || !qty || !selectedProduct || !selectedUom || !customerName}
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