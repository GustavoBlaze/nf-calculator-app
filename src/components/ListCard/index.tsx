import {
  View,
  TouchableOpacity,
  Text, StyleSheet,
  TouchableOpacityProps
} from 'react-native'

interface IListCard extends TouchableOpacityProps {
  item: InvoiceCalculated
}

const numberToCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function ListCard({item, ...rest}: IListCard) {


  return (
    // <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonCard}
        key={item.id}
        {...rest}>
        <Text style={styles.titleCard}>Dados da NF</Text>
        <Text style={styles.textCard}>Nota Fiscal: {item.invoice}</Text>
        <Text style={styles.textCard}>Cliente: {item.client}</Text>
        <Text style={styles.textCard}>Valor da NF: {numberToCurrency(item?.invoice_value)}</Text>
        <Text style={styles.textCard}>Valor do Pis: {numberToCurrency(item?.pis)}</Text>
        <Text style={styles.textCard}>Valor do Cofins: {numberToCurrency(item?.cofins)}</Text>
        <Text style={styles.textCard}>Valor do Csll: {numberToCurrency(item?.csll)}</Text>
        <Text style={styles.textCard}>Valor do Iss: {numberToCurrency(item.iss)}</Text>
        <Text style={styles.textCard}>Valor Liquido da NF: {numberToCurrency(item?.liquid_value)}</Text>
      </TouchableOpacity>
    // </View>
  )
}

const styles = StyleSheet.create({
  buttonCard: {
    width: '100%',
    padding: 6,
    backgroundColor: '#969CB2',
    borderRadius: 10,
    marginTop: 10,
  },
  textCard: {
    color: '#ffffff',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  titleCard: {
    color: '#ff872c',
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 8,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  separator: {
    marginTop: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  }
})




