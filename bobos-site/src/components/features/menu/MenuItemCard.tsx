import { AddToCartControls } from '@/components/features/menu/AddToCartControls'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { PriceTag } from '@/components/ui/PriceTag'
import { cn } from '@/lib/cn'
import type { MenuItem } from '@/types/menu'

type Props = {
  item: MenuItem
  layout?: 'stacked' | 'horizontal'
}

/** Menu item card: stacked for home favorites, horizontal (smaller photo) on the menu page. */
export function MenuItemCard({ item, layout = 'stacked' }: Props) {
  const isHorizontal = layout === 'horizontal'
  return (
    <Card
      as="article"
      className={cn(
        'grid h-full gap-4',
        isHorizontal && 'sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6',
      )}
    >
      <ImagePlaceholder label={item.name} className={cn(isHorizontal && 'sm:self-start')} />
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-extrabold">{item.name}</h3>
          <PriceTag cents={item.priceCents} className="text-xl" />
        </div>
        {item.isFavorite && <Badge className="self-start">Favorite</Badge>}
        <p className="flex-1 text-muted">{item.description}</p>
        <AddToCartControls item={item} />
      </div>
    </Card>
  )
}
