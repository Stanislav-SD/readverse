import prisma from '../prisma/prisma';
import { ConditionSchema } from '../utils/validationUtils';
import { pagesRead, reading } from './stats';

type Condition = {
  type?: string;
  operation?: string
  value?: any;
  all?: Condition[];
  any?: Condition[];
};

async function addBadge(Image: string, Label: string, Quest: string, Conditions: Condition) {
    console.log(Image, Label, Quest, Conditions)
    Image = Image.trim();
    Label = Label.trim();
    Quest = Quest.trim();
    if (!Image) throw new Error("Image is required");
    if (!Label) throw new Error("Label is required");
    if (!Quest) throw new Error("Quest are required");
    if (!Conditions) throw new Error("Conditions are required");
    
    ConditionSchema.parse(Conditions);

    await prisma.badges.create({
        data: {
            Image,
            Label,
            Quest,
            Conditions,
        }
    });
    return true;
}

async function removeBadge(Id: number) 
{
    try {
        await prisma.badges.delete({ where: { Id } });
  
        return true;
    } catch (error: any) {
        if (error.code === 'P2025')
            throw new Error("Badge not found");

        throw new Error("Something went wrong");
    }
}

async function updateBadge(Id: number, 
    data: {
    Image?: string;
    Label?: string;
    Quest?: string;
    Conditions?: Condition;
}) {
    if (!Id) throw new Error("Badge ID is required");

    const updateData: any = {};

    if (data.Image !== undefined) {
        const image = data.Image.trim();
        if (!image) throw new Error("Image cannot be empty");
        updateData.Image = image;
    }

    if (data.Label !== undefined) {
        const label = data.Label.trim();
        if (!label) throw new Error("Label cannot be empty");
        updateData.Label = label;
    }

    if (data.Quest !== undefined) {
        const quest = data.Quest.trim();
        if (!quest) throw new Error("Quest cannot be empty");
        updateData.Quest = quest;
    }

    if (data.Conditions !== undefined) {
        ConditionSchema.parse(data.Conditions);
        updateData.Conditions = data.Conditions;
    }

    try {
        await prisma.badges.update({
            where: {
                Id
            },
            data: updateData,
        });
  
        return true;
    } catch (error: any) {
        if (error.code === 'P2025')
            throw new Error("Badge not found");

        console.error(error);
        throw new Error("Something went wrong");
    }
}

async function getBadges() {
    const badges = await prisma.badges.findMany();
    return badges;
}


async function getUserBadges(userId: number) {
    return await prisma.userBadges.findMany({
        where: { UserId: userId },
        include: { Badge: true }
    });
}

async function getUserStats(userId: number) {
    const totalPages = await pagesRead(userId);
    const currentReading = await reading(userId);

    return {
        total_pages: totalPages,
        books_read: currentReading,
    }
}

async function checkAndAwardBadges(userId: number) {
    const badges = await prisma.badges.findMany();
    const stats = await getUserStats(userId);
    
    for (const badge of badges) {
        const alreadyEarned = await prisma.userBadges.findUnique({
            where: {
                UserId_BadgeId: {
                UserId: userId,
                BadgeId: badge.Id,
                },
            },
        });

        if (alreadyEarned) continue;

        const passed = evaluate(badge.Conditions, stats);

        if (passed) {
            await prisma.userBadges.create({
                data: {
                UserId: userId,
                BadgeId: badge.Id,
                },
            });
        }
    }
}

function evaluate(condition: any, stats: any): boolean {
    if (condition.all) return condition.all.array((c: any) => evaluate(c, stats));
    if (condition.any) return condition.any.array((c: any) => evaluate(c, stats));

    const value = stats[condition.type];

    switch (condition.operation) {
        case ">=": return value >= condition.value;
        case "==": return value === condition.value;
        case "<=": return value <= condition.value;
        case "includes": return value?.includes(condition.value);
        default: return false;
    }
}

export { addBadge, removeBadge, updateBadge, getBadges, getUserBadges, checkAndAwardBadges };