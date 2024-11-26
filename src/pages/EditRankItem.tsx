import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { 
  Card, 
  CardContent,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '../components';
import { toast } from 'react-hot-toast';

// Réutiliser les types et le schéma de validation de AddRankItem
interface RankItem {
  _id?: string;
  siteName: string;
  logo: string;
  rank: number;
  welcomeBonus: string;
  promoCode: string;
  createAccountUrl: string;
  downloadAppUrl: string;
  advantages: string[];
  payments: string[];
}

const rankItemSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  logo: z.string().min(1, 'Logo URL is required'),
  rank: z.number().min(1, 'Rank must be at least 1'),
  welcomeBonus: z.string().min(1, 'Welcome bonus is required'),
  promoCode: z.string().min(1, 'Promo code is required'),
  createAccountUrl: z.string().min(1, 'Create account URL is required'),
  downloadAppUrl: z.string().min(1, 'Download app URL is required'),
  advantages: z.array(z.string()).min(1, 'At least one advantage is required'),
  payments: z.array(z.string()).min(1, 'At least one payment method is required'),
});

type FormData = z.infer<typeof rankItemSchema>;
/**
 * Page to edit a rank item.
 *
 * The page displays a form with all the existing item's data pre-filled.
 * The user can edit the form fields and submit the form to update the item.
 * If the update is successful, it redirects the user to the home page.
 * If an error occurs during the update, it displays an error toast and logs the error.
 *
 * The page also displays a list of all existing rank items in a card view.
 * The user can switch between the form view and the card view by clicking the corresponding button.
 *
 * @returns {JSX.Element}
 */
const EditRankItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(rankItemSchema),
    defaultValues: {
      advantages: [''],
      payments: [''],
    },
  });

  const advantages = watch('advantages');
  const payments = watch('payments');

  /**
   * Adds a new field to the given array field (advantages or payments).
   * The new field is added to the end of the array.
   * @param fieldName The name of the array field to add the new field to
   */
  const addField = (fieldName: keyof Pick<FormData, 'advantages' | 'payments'>) => {
    const currentValue = watch(fieldName);
    setValue(fieldName, [...currentValue, '']);
  };

  /**
   * Removes the field at the given index from the given array field (advantages or payments).
   * @param fieldName The name of the array field to remove the field from
   * @param index The index of the field to remove
   */
  const removeField = (
    fieldName: keyof Pick<FormData, 'advantages' | 'payments'>, 
    index: number
  ) => {
    const currentValue = watch(fieldName);
    setValue(
      fieldName,
      currentValue.filter((_, i) => i !== index)
    );
  };

  // Charger les données existantes
  useEffect(() => {
  /**
   * Fetches the rank item with the given id and updates the form with its data.
   * If the request fails, it shows an error toast and redirects to the add page.
   * @throws {Error} If the request fails
   */
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rankitems/${id}`);
        if (!response.ok) throw new Error('Failed to fetch item');
        const data = await response.json();
        
        // Mettre à jour tous les champs du formulaire
        reset(data);
      } catch (error) {
        toast.error('Error fetching item');
        console.error(error);
        navigate('/add'); // Rediriger vers la page d'ajout en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, reset, navigate]);

  /**
   * Updates the rank item with the given id with the provided data.
   * 
   * If the request succeeds, it shows a success toast and redirects to the add page.
   * If the request fails, it shows an error toast and logs the error.
   * 
   * @param {RankItem} data - The data to update the rank item with.
   */
  const handleUpdate = async (data: RankItem) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rankitems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update item');
      
      toast.success('Item updated successfully');
      navigate('/add-rank-item'); // Rediriger vers la page principale après la mise à jour
    } catch (error) {
      toast.error('Error updating item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/add-rank-item')}
            className="flex items-center gap-2 text-gray-300 hover:text-white group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to List
          </button>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Controller
                    name="siteName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Site Name"
                        error={errors.siteName?.message}
                      />
                    )}
                  />

                  <Controller
                    name="logo"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Logo URL"
                        error={errors.logo?.message}
                      />
                    )}
                  />

                  <Controller
                    name="rank"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <SelectTrigger error={errors.rank?.message}>
                          <SelectValue placeholder="Select Rank" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rank) => (
                            <SelectItem key={rank} value={rank.toString()}>
                              Rank #{rank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    name="welcomeBonus"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Welcome Bonus"
                        error={errors.welcomeBonus?.message}
                      />
                    )}
                  />

                  <Controller
                    name="promoCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Promo Code"
                        error={errors.promoCode?.message}
                      />
                    )}
                  />
                  <Controller
                    name="createAccountUrl"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Create Account URL"
                        error={errors.createAccountUrl?.message}
                      />
                    )}
                  />
                  <Controller
                    name="downloadAppUrl"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Download App URL"
                        error={errors.downloadAppUrl?.message}
                      />
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Advantages
                    </label>
                    <div className="space-y-2">
                      {advantages.map((_, index) => (
                        <div key={index} className="flex gap-2">
                          <Controller
                            name={`advantages.${index}`}
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Enter advantage" />
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeField('advantages', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => addField('advantages')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Advantage
                    </Button>
                    {errors.advantages && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.advantages.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Payment Methods
                    </label>
                    <div className="space-y-2">
                      {payments.map((_, index) => (
                        <div key={index} className="flex gap-2">
                          <Controller
                            name={`payments.${index}`}
                            control={control}
                            render={({ field }) => (
                              <Input {...field} placeholder="Enter payment method" />
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeField('payments', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => addField('payments')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                    {errors.payments && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.payments.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Rank Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditRankItem;
