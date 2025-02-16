
// Gender
export const genderEnum = {
    MALE:'male',
    FEMALE:'female',
    NOT_SPECIFIED:'not-specified'
}

// Roles
export const systemRoles = {
    ADMIN:'admin',
    USER:'user' ,
    SUPER_ADMIN:'super-admin'
}

// Combined Roles to be used on routers
const {ADMIN, USER, SUPER_ADMIN} = systemRoles
export const ADMIN_USER = [ADMIN, USER]
export const ADMIN_SUPER_ADMIN = [ADMIN, SUPER_ADMIN]
export const USER_SUPER_ADMIN = [USER, SUPER_ADMIN]

// Providers
export const ProvidersEnum ={
    GOOGLE:'google',
    FACEBOOK:'facebook',
    SYSTEM:'system'
}

// Extensions
export const ImageExtensions = ['image/jpg','image/jpeg','image/png']
export const VideoExtensions = ['video/mp4', 'video/avi', 'video/mov']
export const DocumentExtensions = ['application/pdf' , 'application/json' , 'application/javascript']


// Reacts
export  const Reacts = {
    LIKE:'like',
    LOVE:'love',
    HAHA:'haha',
    WOW:'wow',
    SAD:'sad',
    ANGRY:'angry'
}