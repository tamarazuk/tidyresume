"use client"

import { ArrowRightIcon, PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useResumeStore } from '@/stores/resume-store'
import { cn } from '@/lib/utils'

export function StartButton() {
    const [mounted, setMounted] = useState(false)
    const resumeId = useResumeStore((state) => state.id)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button size="lg" disabled className="gap-2 px-8">
                Start Writing Now
                <ArrowRightIcon size={20} />
            </Button>
        )
    }

    if (resumeId) {
        return (
            <Link
                href="/edit"
                className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-8')}
            >
                <PencilSimpleIcon size={20} />
                Continue Editing
            </Link>
        )
    }

    return (
        <Link
            href="/edit"
            className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-8')}
        >
            Start Writing Now
            <ArrowRightIcon size={20} />
        </Link>
    )
}
