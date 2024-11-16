import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Trophy,
  Star,
  Wallet,
  Gift,
  Edit,
  Trash2,
  LayoutGrid,
  FileInput,
  Plus,
  X
} from 'lucide-react';
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

// Types
interface RankItem {
  _id?: string;
  siteName: string;
  logo: string;
  rank: number;
  welcomeBonus: string;
  promoCode: string;
  advantages: string[];
  payments: string[];
}

// Schema de validation
const rankItemSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  logo: z.string().min(1, 'Logo URL is required'),
  rank: z.number().min(1, 'Rank must be at least 1'),
  welcomeBonus: z.string().min(1, 'Welcome bonus is required'),
  promoCode: z.string().min(1, 'Promo code is required'),
  advantages: z.array(z.string().nonempty()).min(1, 'At least one advantage is required'),
  payments: z.array(z.string().nonempty()).min(1, 'At least one payment method is required'),
});

type FormData = z.infer<typeof rankItemSchema>;

/**
 * Page to add a new rank item. Allows the user to input the site name, logo url, rank, welcome bonus, promo code, advantages, and payment methods.
 * Once the form is submitted, the new rank item is created and the user is redirected back to the home page.
 * The page also displays a list of all existing rank items in a card view.
 * The user can switch between the form view and the card view by clicking the corresponding button.
 * @returns {JSX.Element}
 */
const AddRankItem = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'form' | 'card'>('form');
  const [allItems, setAllItems] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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
   * Removes the field at the given index from the given array field (advantages or payments).
   * @param fieldName The name of the array field to remove the field from
   * @param index The index of the field to remove
   */


    /**
   * Adds a new field to the given array field (advantages or payments).
   * The new field is added to the end of the array.
   * @param fieldName The name of the array field to add the new field to
   */
    const addField = (fieldName: keyof Pick<FormData, 'advantages' | 'payments'>) => {
      const currentValue = watch(fieldName);
      setValue(fieldName, [...currentValue, '']);
    };
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

  // Fonctions API
  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rankitems');
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setAllItems(data);
    } catch (error) {
      toast.error('Error fetching items');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

/**
 * Creates a new rank item by sending a POST request to the server with the provided data.
 * 
 * If the item is created successfully, it shows a success toast, resets the form, 
 * and fetches the updated list of items. If an error occurs during creation, it 
 * displays an error toast and logs the error.
 * 
 * @param {RankItem} data - The data of the rank item to be created.
 */
const handleCreate = async (data: RankItem) => {
  try {
    setLoading(true);
    const response = await fetch('/api/rankitems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create item');
    
    toast.success('Item created successfully');
    reset();
    fetchAllItems();
  } catch (error) {
    toast.error('Error creating item');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  /**
   * Deletes a rank item by sending a DELETE request to the server with the id of the item.
   * 
   * If the item is deleted successfully, it shows a success toast and fetches the updated list of items.
   * If an error occurs during deletion, it displays an error toast and logs the error.
   * 
   * @param {string} id - The id of the rank item to be deleted.
   */
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/rankitems/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');
      
      toast.success('Item deleted successfully');
      fetchAllItems();
    } catch (error) {
      toast.error('Error deleting item');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  /**
   * Component that renders the form fields for creating a rank item.
   *
   * The form contains the following fields:
   * - Site Name
   * - Logo URL
   * - Rank
   * - Welcome Bonus
   * - Promo Code
   * - Advantages
   * - Payment Methods
   *
   * The form is validated using the zod schema and react-hook-form.
   *
   * The component also handles the submission of the form and displays a success toast
   * if the item is created successfully.
   * If an error occurs during submission, it displays an error toast and logs the error.
   */
  const FormFields = () => (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
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
          {loading ? 'Creating...' : 'Create Rank Item'}
        </Button>
      </div>
    </form>
  );


/**
 * A component that renders a grid of cards, each containing information about
 * a rank item. The component is used in the Rank Items page to display all
 * rank items.
 * 
 * @returns A JSX element representing the grid of cards.
 */
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allItems.map((item) => (
        <Card key={item._id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.logo}
                  alt={item.siteName}
                  className="w-12 h-12 object-contain rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{item.siteName}</h3>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Trophy className="w-4 h-4" /> Rank #{item.rank}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/edit/${item._id}`)}
                >
                  <Edit className="w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item._id!)}
                >
                  <Trash2 className="w-4 text-red-400" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Gift className="w-4 h-4 text-yellow-400" />
                <span>{item.welcomeBonus}</span>
              </div>

              <div>
                <h4 className="text-gray-400 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Advantages
                </h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {item.advantages.map((advantage, index) => (
                    <li key={index}>{advantage}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-gray-400 mb-2 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-yellow-400" />
                  Payment Methods
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.payments.map((payment, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm"
                    >
                      {payment}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-yellow-400 font-medium">
                  Promo Code: {item.promoCode}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-white group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'form' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('form')}
            >
              <FileInput className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('card')}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            {viewMode === 'form' ? <FormFields /> : <CardView />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddRankItem;