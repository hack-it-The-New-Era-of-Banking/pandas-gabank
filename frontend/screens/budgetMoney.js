import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { saveSalary } from '../backend/budgetPlan'; // Assuming you have the saveSalary function in a backend file
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

  const handleSubmitIncome = async () => {
    if (!parsedIncome || parsedIncome <= 0) return;

    try {
      // Call the saveSalary function to save the data to Firestore
      await saveSalary(budgetData);
      
      console.log('Budget Data Saved:', budgetData);
      setSubmitted(true); // Show the budget allocation breakdown after saving
    } catch (error) {
      console.error('Error saving budget data:', error);
    }
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

        
            
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
