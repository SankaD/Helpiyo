import React, { Component } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import {SafeAreaView} from 'react-navigation';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from '../custom_modal/component';
import styles from './styles';
import currencies from '../../utils/currencies';

export default class CurrencySelector extends Component {
    state = {
      modalVisible: false,
      selectedCurrency: this.props.selectedCurrency,
      filter: '',
    };
    hideModal() {
      this.setState({ modalVisible: false });
    }
    showModal() {
      this.setState({ modalVisible: true });
    }
    setCurrency(currency) {
      this.setState({ selectedCurrency: currency, modalVisible: false });
      this.props.onCurrencySelect(currency);
    }
    renderCurrency(currency) {
      if (!currency) {
        return null;
      }
      return (
        <TouchableOpacity
          key={currency.code}
          style={styles.countryButton}
          onPress={() => { this.setCurrency(currency.code); }}
        >
          <View style={styles.countryPanel}>
            <Text style={styles.modalCurrency}>{currency.code}</Text>
            <Text style={styles.currencyName}>{currency.name}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    renderCurrencyList(filter) {
      return Object.keys(currencies)
        .filter((currency) => {
          const cur = currencies[currency];
          return cur.code.toLowerCase().includes(filter.toLowerCase())
              || cur.name.toLowerCase().includes(filter.toLowerCase());
        }).map(currency => this.renderCurrency(currencies[currency]));
    }
    render() {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => this.showModal()}
          >
            <View style={styles.pickerContainer}>
              <Text style={styles.currency}>{this.state.selectedCurrency}</Text>
            </View>
          </TouchableOpacity>
          <CustomModal
            modalVisible={this.state.modalVisible}
            hideModal={() => this.hideModal()}
          >
            <View style={styles.modalContainer}>
              <View style={styles.filterContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => this.hideModal()}>
                  <Icon name="arrow-left" size={24} style={styles.backIcon} />
                </TouchableOpacity>
                <TextInput
                  style={styles.filter}
                  onChangeText={(text) => { this.setState({ filter: text }); }}
                  placeholder="Filter currencies..."
                />
              </View>
              <ScrollView style={styles.currencyList}>
                {this.renderCurrencyList(this.state.filter)}
              </ScrollView>
            </View>
          </CustomModal>
        </View>
      );
    }
}

CurrencySelector.propTypes = {
  selectedCurrency: PropTypes.string.isRequired,
  onCurrencySelect: PropTypes.func.isRequired,
};

