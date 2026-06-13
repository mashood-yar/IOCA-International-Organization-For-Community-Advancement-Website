import { supabase } from './supabase';

export const saveDonation = async (donor_name: string, email: string, phone: string, payment_method: string, amount: number, message: string) => {
  const { error } = await supabase.from('donations').insert({ 
    donor_name, 
    email,
    phone,
    payment_method,
    amount, 
    message 
  });
  return !error;
};
