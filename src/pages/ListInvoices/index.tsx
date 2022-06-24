import { useState, useEffect, useCallback, useMemo } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, FlatList, Alert, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Header } from "../../components/Header";
import { ListCard } from '../../components/ListCard';


const buildInvoiceTaxes = (invoice: Invoice) : InvoiceCalculated => {
  const result: InvoiceCalculated = {
    ...invoice,
    pis: invoice.invoice_value * (0.65 / 100),
    cofins: invoice.invoice_value * (3 / 100),
    iss: invoice.invoice_value * (4 / 100),
    csll: invoice.invoice_value * (1 / 100),
    liquid_value: 0
  }

  result.liquid_value = result.invoice_value - result.pis - result.cofins - result.iss - result.csll

  return result;
}

const transformInvoices = (invoices: Invoice[]) : InvoiceCalculated[] => invoices.map(buildInvoiceTaxes)

type InvoiceNumberFields = Omit<keyof InvoiceCalculated, 'invoice' | 'client'>

const buildSum = (key: InvoiceNumberFields) => (acc: number, current: InvoiceCalculated) => acc + current[key]

const numberToCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function ListInvoices() {
  const [status, setStatus] = useState('')
  const [invoices, setInvoices] = useState<InvoiceCalculated[]>([]);

  const totals = useMemo(() => ({
    invoice_value: numberToCurrency(invoices.reduce(buildSum('invoice_value'), 0)),
    pis: numberToCurrency(invoices.reduce(buildSum('pis'), 0)),
    cofins: numberToCurrency(invoices.reduce(buildSum('cofins'), 0)),
    iss: numberToCurrency(invoices.reduce(buildSum('iss'), 0)),
    csll: numberToCurrency(invoices.reduce(buildSum('csll'), 0)),
    liquid_value: numberToCurrency(invoices.reduce(buildSum('liquid_value'), 0))
  }), [invoices])

  // function handleDeleteInvoice(id: string) {
  //   Alert.alert("Exclusão", 'Tem certeza?', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'OK', onPress: () => {
  //         setStatus('E')
  //         // setInvoiceData(invoiceData =>
  //         //   invoiceData.filter(inv => inv.id !== id))
  //       },
  //     }
  //   ])
  // }

  const loadInvoices = useCallback(() => {
    AsyncStorage.getItem('@si:invoice')
      .then(data => {
        const result: Invoice[] = data ? JSON.parse(data) : []
        return result
      })
      .then(transformInvoices)
      .then(setInvoices)
  }, []);


  useEffect(() => {
    loadInvoices()
  }, [])

  useFocusEffect(loadInvoices);

  // useEffect(() => {
  //   async function saveInvoices() {
  //     await AsyncStorage.setItem('@si:invoice', JSON.stringify(invoiceData))
  //   }
  //   saveInvoices()
  // }, [invoiceData])

  return (
    <View style={styles.container}>
      <Header title='Listam de NF Serviço' />

     <View style={styles.content}>
        <Text style={styles.textCard}>Total do valor da NF: {totals.invoice_value}</Text>
        <Text style={styles.textCard}>Total do valor do Pis: {totals.pis}</Text>
        <Text style={styles.textCard}>Total do valor do Cofins: {totals.cofins}</Text>
        <Text style={styles.textCard}>Total do valor do Csll: {totals.csll}</Text>
        <Text style={styles.textCard}>Total do valor do Iss: {totals.iss}</Text>
        <Text style={styles.textCard}>Total do valor líquido da NF: {totals.liquid_value}</Text>
      </View>


      <FlatList
        data={invoices}
        style={styles.list}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ListCard
            item={item}
            // onPress={() => handleDeleteInvoice(item.id)}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f0f2f5'
  },
  content: {
    marginTop: 5,
    marginLeft: 5,
    padding: 6,
  },
  textCard: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    marginBottom: 4
  },
  list: {
    padding: 10,
    paddingTop: 0,
  }
})

