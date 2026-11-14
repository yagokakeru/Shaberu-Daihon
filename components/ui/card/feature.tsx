import { cn } from '@/lib/utils'
import Image from 'next/image'

type FeatureCardProps = {
    title: string
    description: string
    image: string
    alt: string
    className?: string
}

export default function FeatureCard({
    title,
    description,
    image,
    alt,
    className,
}: FeatureCardProps) {
    return (
        <div
            className={cn(
                'bg-background-surface rounded-lg-pc px-32-pc pt-32-pc pb-40-pc max-md:rounded-lg-sp max-md:p-spvw-[20]',
                className
            )}
        >
            <h3 className="text-heading-h2-pc max-md:text-heading-h3-sp">
                {title}
            </h3>
            <p className="text-text-secondary text-body-default-pc mt-8-pc max-md:text-body-default-sp max-md:mt-8-sp">
                {description}
            </p>
            <Image
                src={image}
                alt={alt}
                width={554}
                height={311}
                className="block mt-16-pc rounded-lg-pc max-md:w-full max-md:h-auto max-md:mt-16-sp max-md:rounded-lg-sp"
            />
        </div>
    )
}
