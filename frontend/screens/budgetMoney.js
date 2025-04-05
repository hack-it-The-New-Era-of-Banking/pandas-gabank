import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { saveSalary } from '../backend/budgetPlan';
import { generateContent } from '../API/chatGenerator';
import addCardStyles from '../styles/addCardStyles';
import Header from '../components/header';

export default function BudgetMoney({ navigation }) {
  const [income, setIncome] = useState('');
  const [isWeekly, setIsWeekly] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [budgetPlan, setBudgetPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const parsedIncome = parseFloat(income) || 0;
  const period = isWeekly ? 'Weekly' : 'Monthly';

  const handleSubmitIncome = async () => {
    if (!parsedIncome || parsedIncome <= 0) {
      console.log('Invalid income value');
      return;
    }

    setLoading(true);
    try {
      await saveSalary({ totalIncome: parsedIncome, frequency: period });

      const { success, generatedText, message } = await generateContent(
        `Generate me a detailed budget plan for an income of ₱${income}. Calculate the following:
        - 50% for needs
        - 30% for wants
        - 20% for savings.
        Provide the breakdown and any additional recommendations for budgeting and saving. But Strictly Dont talk Like an AI. and remove unnecessary "*" or asterisks.`
      );

      if (success) {
        setBudgetPlan(generatedText);
        setSubmitted(true);
      } else {
        setBudgetPlan(message);
      }
    } catch (error) {
      setBudgetPlan('Error generating or saving data, please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
            backgroundColor: '#fff',
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Header />
          <Text style={addCardStyles.titletext}>Create Budget</Text>
          <Text style={addCardStyles.subtitleText}>
            Enter your {period.toLowerCase()} allowance or salary to generate a plan.
          </Text>

          <TextInput
            style={addCardStyles.budgetinput}
            placeholder="Enter your income (₱)"
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
            returnKeyType="done"
          />

          <TouchableOpacity style={addCardStyles.genbutton} onPress={handleSubmitIncome}>
            <Text style={addCardStyles.buttonText}>Generate Budget Plan</Text>
          </TouchableOpacity>

          {loading && (
            <Text style={addCardStyles.subtitleText}>Loading...</Text>
          )}

          {submitted && (
            <View style={[addCardStyles.budgetBox, { marginTop: 20 }]}>
              <Text style={addCardStyles.budgetTitle}>{period} Budget Allocation</Text>
              <Text style={[addCardStyles.budgetLine, { whiteSpace: 'pre-line' }]}>{budgetPlan}</Text>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
