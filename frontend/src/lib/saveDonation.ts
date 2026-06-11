import { supabase } from './supabase';

export const saveDonation = async (donor_name: string, amount: number, message: string) => {
  const { error } = await supabase.from('donations').insert({ donor_name, amount, message });
  return !error;
};
