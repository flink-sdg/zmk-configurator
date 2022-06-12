import {createRouter, createWebHistory} from 'vue-router';
import Home from '../views/home.vue';

const router = createRouter({
                                history: createWebHistory(import.meta.env.BASE_URL),
                                routes:  [
                                    {
                                        path:      '/:catchAll(.*)',
                                        component: Home,
                                        meta: {
                                            title: 'zmk-configurator'
                                        },
                                    }
                                ]
                            });

export default router;
