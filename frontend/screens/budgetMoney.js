import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import addCardStyles from '../styles/addCardStyles';
import Header from '../components/header';

export default function BudgetMoney({ navigation }) {
  const [income, setIncome] = useState('');
  const [isWeekly, setIsWeekly] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bankNameFocused, setbankNameFocused] = useState(false);

  const parsedIncome = parseFloat(income) || 0;
  const period = isWeekly ? 'Weekly' : 'Monthly';

  const breakdown = {
    needs: parsedIncome * 0.5,
    wants: parsedIncome * 0.3,
    savings: parsedIncome * 0.2,
  };

  const budgetData = {
    totalIncome: parsedIncome,
    breakdown,
    frequency: period,
    createdAt: new Date().toISOString(),
  };

  const handleSubmitIncome = () => {
    if (!parsedIncome || parsedIncome <= 0) return;
    console.log('Budget Data Ready:', budgetData);
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <Header />
          <ScrollView
            contentContainerStyle={addCardStyles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={addCardStyles.titletext}>Create Budget</Text>
            <Text style={addCardStyles.subtitleText}>
              Enter your {period.toLowerCase()} allowance or salary to generate a plan.
            </Text>

            {/* Income Input */}
            <TextInput
              style={[
                addCardStyles.budgetinput,
                { borderBottomColor: bankNameFocused ? '#6FB513' : '#ccc' },
              ]}
              placeholder="Enter your income (₱)"
              keyboardType="numeric"
              value={income}
              onChangeText={setIncome}
              onFocus={() => setbankNameFocused(true)}
              onBlur={() => setbankNameFocused(false)}
              returnKeyType="done"
            />

            {/* Submit Button */}
            <TouchableOpacity style={addCardStyles.genbutton} onPress={handleSubmitIncome}>
              <Text style={addCardStyles.buttonText}>Generate Budget Plan</Text>
            </TouchableOpacity>
            
            {/* Toggle Monthly/Weekly */}
            {/* <View style={addCardStyles.toggleContainer}>
              <Text style={addCardStyles.toggleLabel}>View as {period} Budget</Text>
              <Switch
                value={isWeekly}
                onValueChange={() => setIsWeekly(prev => !prev)}
                style={{ marginLeft: 10 }}
                trackColor={{ false: '#ccc', true: '#6FB513' }}
                thumbColor="#fff"
              />
            </View> */}
            <Text style={addCardStyles.subtitleText}>Your Budget Plan</Text>
            <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 10 }} />
            {/* Show Breakdown */}
            {submitted && (
              <View style={addCardStyles.budgetBox}>
                <Text style={addCardStyles.budgetTitle}>{period} Budget Allocation</Text>
                <Text style={addCardStyles.budgetLine}>💡 Total: ₱{parsedIncome.toFixed(2)}</Text>
                <Text style={addCardStyles.budgetLine}>🧾 Needs (50%): ₱{breakdown.needs.toFixed(2)}</Text>
                <Text style={addCardStyles.budgetLine}>🎉 Wants (30%): ₱{breakdown.wants.toFixed(2)}</Text>
                <Text style={addCardStyles.budgetLine}>💰 Savings (20%): ₱{breakdown.savings.toFixed(2)}</Text>
              </View>
            )}

            {/* Add Expense Button */}
            {submitted && (
              <TouchableOpacity
                style={addCardStyles.addButton}
                onPress={() => console.log("Add Expense tapped!")}
              >
                <Text style={addCardStyles.addButtonText}>➕ Add Expense</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
