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
import { saveSalary } from '../backend/budgetPlan'; // Keep saveSalary function for saving data
import { generateContent } from '../API/chatGenerator'; // Import the AI function
import addCardStyles from '../styles/addCardStyles';
import Header from '../components/header';

export default function BudgetMoney({ navigation }) {
  const [income, setIncome] = useState('');
  const [isWeekly, setIsWeekly] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [budgetPlan, setBudgetPlan] = useState('');
  const [loading, setLoading] = useState(false);  // Add loading state for AI call

  const parsedIncome = parseFloat(income) || 0;
  const period = isWeekly ? 'Weekly' : 'Monthly';

  const handleSubmitIncome = async () => {
    if (!parsedIncome || parsedIncome <= 0) {
      console.log('Invalid income value');
      return;
    }

    setLoading(true);  // Show loading while waiting for AI response
    try {
      // First, save the salary data to your backend
      await saveSalary({ totalIncome: parsedIncome, frequency: period });

      console.log('Salary Data Saved:', parsedIncome);

      // Send the entire prompt to the AI including the income and the budget breakdown request
      const { success, generatedText, message } = await generateContent(
        `Generate me a detailed budget plan for an income of ₱${income}. Calculate the following:
        - 50% for needs
        - 30% for wants
        - 20% for savings.
        Provide the breakdown and any additional recommendations for budgeting and saving. But Strictly Dont talk Like an AI. and remove unecessarry "*" or asterisks`
      );

      if (success) {
        setBudgetPlan(generatedText);  // Set the AI-generated budget plan
        setSubmitted(true);  // Mark that the budget has been generated
      } else {
        setBudgetPlan(message);  // Handle error response
      }
    } catch (error) {
      setBudgetPlan('Error generating or saving data, please try again.');
      console.error(error);
    } finally {
      setLoading(false);  // Hide loading indicator after the request
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
              style={addCardStyles.budgetinput}
              placeholder="Enter your income (₱)"
              keyboardType="numeric"
              value={income}
              onChangeText={setIncome}
              returnKeyType="done"
            />

            {/* Submit Button */}
            <TouchableOpacity style={addCardStyles.genbutton} onPress={handleSubmitIncome}>
              <Text style={addCardStyles.buttonText}>Generate Budget Plan</Text>
            </TouchableOpacity>

            {/* Loading State */}
            {loading && (
              <Text style={addCardStyles.subtitleText}>Loading...</Text>
            )}

            {/* Show Breakdown or AI-generated Plan */}
            {submitted && (
              <View style={addCardStyles.budgetBox}>
                <Text style={addCardStyles.budgetTitle}>{period} Budget Allocation</Text>
                <Text style={addCardStyles.budgetLine}>{budgetPlan}</Text>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
